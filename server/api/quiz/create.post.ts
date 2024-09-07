
import { z } from "zod";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";

import { ChatVertexAI, VertexAIEmbeddings } from "@langchain/google-vertexai-web"
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";



const quizParsedToPrismaCreate = async ({ themes: themeSelected, ...quiz }, { themes = [] }) => {
    const [found, notFound] = themeSelected.reduce(([found, notFound], theme) => {
        const foundTheme = themes.find(currentTheme => currentTheme.display === theme.display)
        if (foundTheme) {
            return [[...found, foundTheme], notFound]
        }
        return [found, [...notFound, theme]]
    }, [[], []])

    await prisma.theme.createMany({ data: notFound.map(theme => ({ display: theme.display })) })
    const arrayOfTheme = notFound.map(theme => theme.display)
    const insertedThemes = await prisma.theme.findMany({ where: { display: { in: arrayOfTheme } } })

    const arrayOfIdsThemes = new Set()
    insertedThemes.forEach(theme => arrayOfIdsThemes.add(theme.id))
    found.forEach(theme => arrayOfIdsThemes.add(theme.id))

    const quizUpdated = {
        ...quiz,
        themes: {
            createMany: {
                data: [...arrayOfIdsThemes].map(themeId => ({ themeId }))
            }
        },
        questions: {
            create: quiz.questions.map(currentQuestion => {
                const { imagePrompt, ...question } = currentQuestion
                question.answers.sort((a, b) => 0.5 - Math.random());
                return {
                    question: {
                        create: {
                            ...question,
                            questionDuration: 3,
                            answerDuration: 7,
                            answers: {
                                create: question.answers.map(answer => {
                                    return {
                                        ...answer,
                                        selected: false
                                    }
                                })
                            },
                        }
                    }
                }
            })
        },
    }
    return quizUpdated
}

const ThemeSchema = z.object({
    id: z.string().optional().describe(`This is the id of the theme. This is a global name that can be used to identify the theme. If the theme is new, this property is undefined`),
    display: z.string().describe(`A quiz can have multiple themes. This is the name of the theme. This is a global name that can be used to identify the theme. For exemple for a quiz on "Harry Potter" theme could be "Harry Potter", "Sorcier", "Surnaturel" ou "Magie"`),
})

const AnswerSchema = z.object({
    display: z.string(),
    selected: z.boolean(),
    isCorrect: z.boolean(),
});


const QuestionSchema = z.object({
    display: z.string(),
    // picture: z.string(),
    promptPicture: z.string(),
    questionDuration: z.number(),
    answerDuration: z.number(),
    theme: z.string().describe('Brève indiquation donnant un indice sur le type de question qui va être posé.'),
    answers: z.array(AnswerSchema),
})

const QuizSchema = z.object({
    display: z.string(),
    questions: z.array(QuestionSchema),
    themes: z.array(ThemeSchema)
});

const getModel = (modelType: 'openAi' | 'vertexAI') => {
    if (modelType === 'openAi') {
        return new OpenAI({
            model: "gpt-4o-2024-08-06",
        })
    }
    return new ChatVertexAI({
        model: "gemini-1.5-pro",
        temperature: 0,
        maxRetries: 2,
    });
}


export default defineEventHandler(async (event) => {
    // Configuration de l'API OpenAI avec ta clé API

    const { user } = await requireUserSession(event)

    const { modelType = 'openAi' } = getQuery<{ modelType?: 'openAi' | 'vertexAI' }>(event)

    if (!['openAi', 'vertexAI'].includes(modelType)) {
        setResponseStatus(event, 400, 'Invalid modelType')
    }

    const adminEmails = ['mathnewph@gmail.com', 'leptitclementmoreau@gmail.com']

    if (!adminEmails.includes(user.email)) {
        setResponseStatus(event, 400, 'You are not allowed to create a quiz')
    }

    const topicFromUser = getQuery(event).topic as string
    if (!topicFromUser) {
        setResponseStatus(event, 400, 'Missing topic')
    }

    const parser = StructuredOutputParser.fromZodSchema(QuizSchema);
    const themesResponse = await prisma.theme.findMany({ where: { isActive: true, isDeleted: false } })


    const model = getModel(modelType)

    const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(
            `You are a quiz generator.
            A quiz can have a maximum of 3 themes and a minimum of 1. Reuse the already created themes if possible.
            For exemple if the quiz is on the theme "Harry Potter" you could use the theme "Sorcier", "Surnaturel" or "Magie".
            QuestionSchema.theme is the theme of the question and should give a indice on the theme of the question but should be very vast.

            \n{format_instructions}\n{question}`
        ),
        model,
        parser,
    ]);


    const response = await chain.invoke({
        question: `Create a quiz about : ${topicFromUser} in french with 15 questions and 4 answers possible`,
        format_instructions: parser.getFormatInstructions(),
    });

    try {


        const quizParsed = QuizSchema.parse(response)
        const quiz = await quizParsedToPrismaCreate(quizParsed, { themes: themesResponse })
        const quizCreated = await prisma.quiz.create({ data: quiz, include: { questions: { include: { question: { include: { answers: true } } } } } })

        console.log('------ response: ', quizCreated)

        return quizCreated
    } catch (error) {
        console.log('parsing error ?', error)
    }
})
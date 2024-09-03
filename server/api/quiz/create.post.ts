// import OpenAI from "openai";
// import { zodResponseFormat } from "openai/helpers/zod";
// import { z } from "zod";

// import ImageTest from '~/assets/Harry.webp'
// const openai = new OpenAI();

// // const fetchImageAsBlob = async (image) => {
// //     const response = await fetch(image);.sort((a, b) => 0.5 - Math.random());
// //     const blob = await response.blob();
// //     return blob;
// // };

// // const createFileFromBlob = async (image) => {
// //     const blob = await fetchImageAsBlob(image);
// //     const file = new File([blob], 'monImage.webp', { type: blob.type });
// //     return file;
// // };

// // Utiliser la fonction pour créer un File




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

// // const quizzesDatas = [
// //     {
// //         display: 'Test tes connaissances sur Harry Potter',
// //         questions: {
// //             create: [
// //                 {
// //                     question: {
// //                         create: {
// //                             display: 'Quel est le nom complet de Harry Potter ?',
// //                             picture: '/harry_potter.webp',
// //                             questionDuration: 2,
// //                             answerDuration: 5,
// //                             theme: 'Harry Potter',
// //                             answers: {
// //                                 create: [
// //                                     { display: 'Harry James Potter', selected: false, isCorrect: true },
// //                                     { display: 'Harry John Potter', selected: false, isCorrect: false },
// //                                     { display: 'Harry Edward Potter', selected: false, isCorrect: false },
// //                                     { display: 'Harry Albus Potter', selected: false, isCorrect: false }
// //                                 ]
// //                             },


// // const imagePath = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-KxzdtQgHwPaEntmgMwU5FWW3/user-EfJ7UEUvlk7iakbgc8wvoU09/img-ZmAOZVMCgJnjYxwMC3FlxHuv.png?st=2024-08-20T17%3A58%3A26Z&se=2024-08-20T19%3A58%3A26Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-08-19T23%3A10%3A01Z&ske=2024-08-20T23%3A10%3A01Z&sks=b&skv=2024-08-04&sig=GcbWQcGACST6JhAryk89SVLSJwcNxQ3Ug3pB5fIOp/0%3D';


// // (async function () {

// //     try {


// //         const imageFile = await fetch(imagePath).then(res => res.blob())
// //         const arrayBuffer = await imageFile.arrayBuffer()
// //         const buffer = Buffer.from(arrayBuffer)
// //         await uploadFile(buffer, 'default', 'dadadda')
// //     } catch (e) {
// //         console.log('EROR :::::::::::', e)
// //     }
// // })();



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

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


// const generateImagesForQuestions = async (questions) => {
//     // const image = await openai.images.generate({ prompt: "A cute baby sea otter" });
//     const questionsImages = []
//     for (const question of questions) {
//         await sleep(13000)
//         questionsImages.push(new Promise(async (resolve, reject) => {
//             try {

//                 const image = await openai.images.generate({ prompt: question.question.promptPicture });
//                 const imageFile = await fetch(image.data[0].url).then(res => res.blob())
//                 const arrayBuffer = await imageFile.arrayBuffer()
//                 const buffer = Buffer.from(arrayBuffer)
//                 await uploadFile(buffer, 'default', `${question.question.id}.webp`)
//                 resolve({
//                     image: `https://s3.quizwar.app/default/${question.question.id}.webp`,
//                     questionId: question.question.id
//                 })
//             } catch (err) {
//                 reject(err)
//             }
//         }))
//     }
//     return questionsImages
// }


// export default defineEventHandler(async (event) => {

//     // console.log(await createFileFromBlob(ImageTest))
//     // return {}
//     // Initialize OpenAI

//     const { user } = await requireUserSession(event)

//     const adminEmails = ['mathnewph@gmail.com', 'leptitclementmoreau@gmail.com']

//     if (!adminEmails.includes(user.email)) {
//         return setResponseStatus(event, 400, 'You are not allowed to create a quiz')
//     }

//     const topicFromUser = getQuery(event).topic as string
//     if (!topicFromUser) {
//         return setResponseStatus(event, 400, 'Missing topic')
//     }

//     const themesResponse = await prisma.theme.findMany({ where: { isActive: true, isDeleted: false } })
//     // Function to generate a quiz
//     async function generateQuiz(topic: string) {
//         const completion = await openai.beta.chat.completions.parse({
//             model: "gpt-4o-2024-08-06",
//             messages: [
//                 {
//                     role: "system", content: `You are a quiz generator. 
//                     Create a quiz with questions, answers, and labels. 
//                     The property promptPicture is used to generate the question image.
//                     L'image devrait être lié à une question mais ne pas représenter directement la réponse mais plutôt illustrer la question. 
//                     QuestionSchema.theme est le thème de la question et devrait donner un indice sur le theme lié a la question tout en étant très évasif.`
//                 },
//                 {
//                     role: "user", content: `La propriété themes du quiz va permettre de classifier le quiz. Trouve des thèmes en rapport avec ${topic}.
//                         Vous pouvez utiliser les thèmes suivants : ${JSON.stringify(themesResponse)} 
//                         or create a new theme but if it's a new theme the is property HAVE TO BE undefined THIS IS VERY IMPORTANT!
//                         The theme is a global name that does not include specific information of the quiz.
//                         A quiz can have a maximum of 3 themes and a minimum of 1. Reuse the already created themes if possible.
//                         Par exemple si le quiz est sur les Manga, on pourrait utiliser le thème "Histoire", "livre", "Culture Japonaise", "Fantastique", "Science fiction" ou "Aventure".
//                 ` },
//                 {
//                     role: "user", content: `Génère un quiz sur le sujet ${topic}. 
//                 En français avec 15 questions et 4 réponses possible. 
//                 Les réponses doivent être coérentes et pas trop proches pour être incorrectes avec seul une réponse correcte.
//                 Vérifie bien que dans le titre de la question il n'y a pas le libélé de la réponse. 
//                 Par exemple, si la réponse est "Gryffindor" alors la question ne doit pas comporter "Gryffindor" dans son titre. 
//                 Par exemple on pourrais avoir comme question: "Quel est la célèbre maison dans laquelle se trouve Harry Potter ?"`
//                 },
//             ],
//             response_format: zodResponseFormat(QuizSchema, "quiz"),
//         });

//         // Extract the validated quiz data
//         const quiz = completion.choices[0].message.parsed;

//         return quiz;
//     }

//     // Example usage
//     try {
//         const tempQuiz = await generateQuiz(topicFromUser)

//         const quiz = await quizParsedToPrismaCreate(tempQuiz, { themes: themesResponse })
//         const quizCreated = await prisma.quiz.create({ data: quiz, include: { questions: { include: { question: { include: { answers: true } } } } } })

//         // const questionsImages = await Promise.all(await generateImagesForQuestions(quizCreated.questions))


//         // const promisesUpdate = questionsImages.map(({ questionId, image }) => {
//         //     return prisma.question.update({ where: { id: questionId }, data: { picture: image } })
//         // })

//         // await Promise.all(promisesUpdate)

//         return quizCreated




//     } catch (error) {
//         console.log(error)
//         return setResponseStatus(event, 400, error.message)
//     }
// });

import { z } from "zod";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";

import { ChatVertexAI, VertexAIEmbeddings } from "@langchain/google-vertexai-web"
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { VectorStore } from "@langchain/core/vectorstores";
import { formatDocumentsAsString } from "langchain/util/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import type { Document } from "@langchain/core/documents";

export default defineEventHandler(async (event) => {
    // Configuration de l'API OpenAI avec ta clé API

    const { user } = await requireUserSession(event)

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

    // const model = new ChatVertexAI({
    //     model: "gemini-1.5-pro",
    //     temperature: 0,
    //     maxRetries: 2,
    // });

    // const embeddings = new VertexAIEmbeddings({ model: "text-multilingual-embedding-002" });

    // const vectorStore = await MemoryVectorStore.fromTexts(
    //     themesResponse.map((theme) => theme.display),
    //     themesResponse.map((theme) => ({ id: theme.id, display: theme.display })),
    //     new VertexAIEmbeddings({ model: "gemini-1.5-pro" }),
    //     {}
    // );


    const model = new OpenAI({
        model: "gpt-4o-2024-08-06",
    })

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
      });


      
    const vectorStore = new MemoryVectorStore(embeddings);

    const documents: Document[] = themesResponse.map((theme) => ({ pageContent: theme.display || '', metadata: { id: theme.id, display: theme.display } }));

    await vectorStore.addDocuments(documents);





    const retriever = vectorStore.asRetriever();


    const chain = RunnableSequence.from([
        // {
        //     context: retriever.pipe(formatDocumentsAsString),
        //     question: new RunnablePassthrough(),
        // },
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
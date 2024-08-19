import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import ImageTest from '~/assets/Harry.webp'
const openai = new OpenAI();

// const fetchImageAsBlob = async (image) => {
//     const response = await fetch(image);.sort((a, b) => 0.5 - Math.random());
//     const blob = await response.blob();
//     return blob;
// };

// const createFileFromBlob = async (image) => {
//     const blob = await fetchImageAsBlob(image);
//     const file = new File([blob], 'monImage.webp', { type: blob.type });
//     return file;
// };

// Utiliser la fonction pour créer un File

const quizParsedToPrismaCreate = (quiz) => {
    const quizUpdated = {
        ...quiz,
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
                                create: question.answers
                            },
                        }
                    }
                }
            })
        },
    }
    return quizUpdated
}

// const quizzesDatas = [
//     {
//         display: 'Test tes connaissances sur Harry Potter',
//         questions: {
//             create: [
//                 {
//                     question: {
//                         create: {
//                             display: 'Quel est le nom complet de Harry Potter ?',
//                             picture: '/harry_potter.webp',
//                             questionDuration: 2,
//                             answerDuration: 5,
//                             theme: 'Harry Potter',
//                             answers: {
//                                 create: [
//                                     { display: 'Harry James Potter', selected: false, isCorrect: true },
//                                     { display: 'Harry John Potter', selected: false, isCorrect: false },
//                                     { display: 'Harry Edward Potter', selected: false, isCorrect: false },
//                                     { display: 'Harry Albus Potter', selected: false, isCorrect: false }
//                                 ]
//                             },

const AnswerSchema = z.object({
    display: z.string(),
    selected: z.boolean(),
    isCorrect: z.boolean(),
});


const QuestionSchema = z.object({
    display: z.string(),
    picture: z.string(),
    promptPicture: z.string(),
    questionDuration: z.number(),
    answerDuration: z.number(),
    theme: z.string().describe('Brève indiquation sur le type de question'),
    answers: z.array(AnswerSchema),
})

const QuizSchema = z.object({
    display: z.string(),
    questions: z.array(QuestionSchema)
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


const generateImagesForQuestions = async (questions) => {
    // const image = await openai.images.generate({ prompt: "A cute baby sea otter" });
    const questionsImages = []
    for (const question of questions) {
        await sleep(13000)
        questionsImages.push(new Promise(async (resolve, reject) => {
            try {

                const image = await openai.images.generate({ prompt: question.question.promptPicture });
                console.log('image', image)
                resolve({
                    image: image,
                    questionId: question.question.id
                })
            } catch (err) {
                reject(err)
            }
        }))
    }
    return questionsImages
}


export default defineEventHandler(async (event) => {

    // console.log(await createFileFromBlob(ImageTest))
    // return {}
    // Initialize OpenAI

    const topicFromUser = getQuery(event).topic as string
    if (!topicFromUser) {
        return setResponseStatus(event, 400, 'Missing topic')
    }

    // Function to generate a quiz
    async function generateQuiz(topic: string) {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                { role: "system", content: "You are a quiz generator. Create a quiz with questions, answers, and labels. The property promptPicture is used to generate the question image. L'image devrait être lié à une question mais ne pas représenter directement la réponse mais plutôt illustrer la question" },
                { role: "user", content: `Génère un quiz sur le sujet ${topic}. En français avec 10 questions et 4 réponses possible. Les réponses doivent être coérentes et pas trop proches pour être incorrectes avec seul une réponse correcte.` },
            ],
            response_format: zodResponseFormat(QuizSchema, "quiz"),
        });

        // Extract the validated quiz data
        const quiz = completion.choices[0].message.parsed;

        return quiz;
    }

    // Example usage
    try {
        const tempQuiz = await generateQuiz(topicFromUser)

        const quiz = quizParsedToPrismaCreate(tempQuiz)

        const quizCreated = await prisma.quiz.create({ data: quiz, include: { questions: { include: { question: { include: { answers: true } } } } } })

        const questionsImages = await Promise.all(await generateImagesForQuestions(quizCreated.questions))


        const promisesUpdate = questionsImages.map(({ questionId, image }) => {
            return prisma.question.update({ where: { id: questionId }, data: { picture: image.data[0].url } })
        })

        await Promise.all(promisesUpdate)

        return questionsImages




    } catch (error) {
        console.log(error)
        return setResponseStatus(event, 400, error.message)
    }
});
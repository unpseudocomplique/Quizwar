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


// const imagePath = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-KxzdtQgHwPaEntmgMwU5FWW3/user-EfJ7UEUvlk7iakbgc8wvoU09/img-ZmAOZVMCgJnjYxwMC3FlxHuv.png?st=2024-08-20T17%3A58%3A26Z&se=2024-08-20T19%3A58%3A26Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-08-19T23%3A10%3A01Z&ske=2024-08-20T23%3A10%3A01Z&sks=b&skv=2024-08-04&sig=GcbWQcGACST6JhAryk89SVLSJwcNxQ3Ug3pB5fIOp/0%3D';


// (async function () {

//     try {


//         const imageFile = await fetch(imagePath).then(res => res.blob())
//         const arrayBuffer = await imageFile.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)
//         await uploadFile(buffer, 'default', 'dadadda')
//     } catch (e) {
//         console.log('EROR :::::::::::', e)
//     }
// })();





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
                console.log('image', image.data[0].url)
                const imageFile = await fetch(image.data[0].url).then(res => res.blob())
                const arrayBuffer = await imageFile.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                await uploadFile(buffer, 'default', `${question.question.id}.webp`)
                resolve({
                    image: `https://s3.quizwar.app/default/${question.question.id}.webp`,
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
                { role: "system", content: "You are a quiz generator. Create a quiz with questions, answers, and labels. The property promptPicture is used to generate the question image. L'image devrait être lié à une question mais ne pas représenter directement la réponse mais plutôt illustrer la question. QuestionSchema.theme est le thème de la question et devrait donner un indice sur le theme lié a la question." },
                { role: "user", content: `Génère un quiz sur le sujet ${topic}. En français avec 15 questions et 4 réponses possible. Les réponses doivent être coérentes et pas trop proches pour être incorrectes avec seul une réponse correcte.` },
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

        // const questionsImages = await Promise.all(await generateImagesForQuestions(quizCreated.questions))


        // const promisesUpdate = questionsImages.map(({ questionId, image }) => {
        //     return prisma.question.update({ where: { id: questionId }, data: { picture: image } })
        // })

        // await Promise.all(promisesUpdate)

        return quizCreated




    } catch (error) {
        console.log(error)
        return setResponseStatus(event, 400, error.message)
    }
});
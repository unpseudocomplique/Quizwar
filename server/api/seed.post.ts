export default defineEventHandler(async (event) => {
    // Suppression des anciennes données
    await prisma.quiz.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.answer.deleteMany({});
    await prisma.label.deleteMany({});
    await prisma.questionLabel.deleteMany({});

    // Création des nouvelles données
    const quiz = await prisma.quiz.create({
        data: {
            display: 'Test tes connaissances générales',
            questions: {
                create: [
                    {
                        question: {
                            create: {
                                display: 'Quel est le nom de ce pont ?',
                                picture: '/pont.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Ponts du monde',
                                answers: {
                                    create: [
                                        { display: 'Golden bridge', selected: false, isCorrect: true },
                                        { display: 'Golden shower', selected: false, isCorrect: false },
                                        { display: 'Golden crow', selected: false, isCorrect: false },
                                        { display: 'Golden boy', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Pont'
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        question: {
                            create: {
                                display: 'Pour les alcolos, quel est le nom de ce cocktail ?',
                                picture: '/fib.webp',
                                questionDuration: 2,
                                answerDuration: 6,
                                theme: 'Cocktails',
                                answers: {
                                    create: [
                                        { display: 'Gin Fizz', selected: false, isCorrect: true },
                                        { display: 'Americano', selected: false, isCorrect: false },
                                        { display: 'Apple Fizz', selected: false, isCorrect: false },
                                        { display: 'Mai Tai', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Cocktail'
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        }
    });

    return quiz;
});

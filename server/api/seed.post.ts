export default defineEventHandler(async (event) => {
    // Suppression des anciennes données
    await prisma.questionLabel.deleteMany({});
    await prisma.quizQuestion.deleteMany({});
    await prisma.answer.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.label.deleteMany({});
    await prisma.quiz.deleteMany({});

    // Création des nouvelles données
    const quiz = await prisma.quiz.create({
        data: {
            display: 'Test tes connaissances sur Harry Potter',
            questions: {
                create: [
                    {
                        question: {
                            create: {
                                display: 'Quel est le nom complet de Harry Potter ?',
                                picture: '/harry_potter.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Harry Potter',
                                answers: {
                                    create: [
                                        { display: 'Harry James Potter', selected: false, isCorrect: true },
                                        { display: 'Harry John Potter', selected: false, isCorrect: false },
                                        { display: 'Harry Edward Potter', selected: false, isCorrect: false },
                                        { display: 'Harry Albus Potter', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Personnage'
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
                                display: 'Quel est le nom de la maison de Gryffindor ?',
                                picture: '/gryffindor.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Maisons',
                                answers: {
                                    create: [
                                        { display: 'Gryffindor', selected: false, isCorrect: true },
                                        { display: 'Slytherin', selected: false, isCorrect: false },
                                        { display: 'Ravenclaw', selected: false, isCorrect: false },
                                        { display: 'Hufflepuff', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Maison'
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
                                display: 'Qui est le directeur de Poudlard pendant la majeure partie de la série ?',
                                picture: '/dumbledore.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Personnages',
                                answers: {
                                    create: [
                                        { display: 'Albus Dumbledore', selected: false, isCorrect: true },
                                        { display: 'Severus Snape', selected: false, isCorrect: false },
                                        { display: 'Minerva McGonagall', selected: false, isCorrect: false },
                                        { display: 'Gellert Grindelwald', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Directeur'
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
                                display: 'Quel est le nom du frère de Sirius Black ?',
                                picture: '/sirius_black.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Famille',
                                answers: {
                                    create: [
                                        { display: 'Regulus Black', selected: false, isCorrect: true },
                                        { display: 'Remus Lupin', selected: false, isCorrect: false },
                                        { display: 'James Potter', selected: false, isCorrect: false },
                                        { display: 'Peter Pettigrew', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Frère'
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
                                display: 'Quelle est la position de Harry Potter dans l\'équipe de Quidditch de Gryffindor ?',
                                picture: '/quidditch.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Quidditch',
                                answers: {
                                    create: [
                                        { display: 'Attrapeur', selected: false, isCorrect: true },
                                        { display: 'Poursuiveur', selected: false, isCorrect: false },
                                        { display: 'Gardien', selected: false, isCorrect: false },
                                        { display: 'Batteur', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Position'
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
                                display: 'Quel est le nom de la pierre magique qui confère l\'immortalité ?',
                                picture: '/pierre.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Objets magiques',
                                answers: {
                                    create: [
                                        { display: 'La Pierre Philosophale', selected: false, isCorrect: true },
                                        { display: 'La Pierre de Lune', selected: false, isCorrect: false },
                                        { display: 'La Pierre de Vie', selected: false, isCorrect: false },
                                        { display: 'La Pierre du Destin', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Pierre'
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
                                display: 'Quel est le sort utilisé pour repousser les Détraqueurs ?',
                                picture: '/dementor.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Sorts',
                                answers: {
                                    create: [
                                        { display: 'Expecto Patronum', selected: false, isCorrect: true },
                                        { display: 'Expelliarmus', selected: false, isCorrect: false },
                                        { display: 'Avada Kedavra', selected: false, isCorrect: false },
                                        { display: 'Lumos', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Sort'
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
                                display: 'Quel est le prénom du père de Ron Weasley ?',
                                picture: '/ron_weasley.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Famille',
                                answers: {
                                    create: [
                                        { display: 'Arthur', selected: false, isCorrect: true },
                                        { display: 'Percy', selected: false, isCorrect: false },
                                        { display: 'Fred', selected: false, isCorrect: false },
                                        { display: 'George', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Famille'
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
                                display: 'Quelle est la créature magique qui garde le coffre de Gringotts ?',
                                picture: '/goblin.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Créatures magiques',
                                answers: {
                                    create: [
                                        { display: 'Gobelin', selected: false, isCorrect: true },
                                        { display: 'Elfe de maison', selected: false, isCorrect: false },
                                        { display: 'Dragon', selected: false, isCorrect: false },
                                        { display: 'Griffon', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Créature'
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
                                display: 'Quelle est la langue que parle Harry Potter avec les serpents ?',
                                picture: '/snake.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Langues',
                                answers: {
                                    create: [
                                        { display: 'Fourchelang', selected: false, isCorrect: true },
                                        { display: 'Gibberish', selected: false, isCorrect: false },
                                        { display: 'Runes', selected: false, isCorrect: false },
                                        { display: 'Elfe', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Langue'
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
                                display: 'Quelle est la potion qui rend invisible ?',
                                picture: '/invisibility_cloak.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Potions',
                                answers: {
                                    create: [
                                        { display: 'Potion d\'invisibilité', selected: false, isCorrect: false },
                                        { display: 'Potion de Polyjuice', selected: false, isCorrect: false },
                                        { display: 'Cape d\'invisibilité', selected: false, isCorrect: true },
                                        { display: 'Potion de Force', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Potion'
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
                                display: 'Quel est le nom de la sorcière qui a fondé Poudlard avec Godric Gryffondor ?',
                                picture: '/helga_hufflepuff.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Fondateurs',
                                answers: {
                                    create: [
                                        { display: 'Helga Poufsouffle', selected: false, isCorrect: true },
                                        { display: 'Rowena Serdaigle', selected: false, isCorrect: false },
                                        { display: 'Minerva McGonagall', selected: false, isCorrect: false },
                                        { display: 'Sybill Trelawney', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Fondatrice'
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
                                display: 'Quel est le nom du elfe de maison de la famille Black ?',
                                picture: '/house_elf.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Elfes de maison',
                                answers: {
                                    create: [
                                        { display: 'Kreacher', selected: false, isCorrect: true },
                                        { display: 'Dobby', selected: false, isCorrect: false },
                                        { display: 'Winky', selected: false, isCorrect: false },
                                        { display: 'Nobby', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Elfe'
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
                                display: 'Quel est le nom du magasin de baguettes magique de Ollivander ?',
                                picture: '/wand_shop.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Magasins',
                                answers: {
                                    create: [
                                        { display: 'Ollivanders', selected: false, isCorrect: true },
                                        { display: 'Flourish and Blotts', selected: false, isCorrect: false },
                                        { display: 'Weasleys\' Wizard Wheezes', selected: false, isCorrect: false },
                                        { display: 'The Leaky Cauldron', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Magasin'
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
                                display: 'Quel est le nom de la créature qui protège le secret de la Chambre des Secrets ?',
                                picture: '/basilisk.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Créatures magiques',
                                answers: {
                                    create: [
                                        { display: 'Basilic', selected: false, isCorrect: true },
                                        { display: 'Hydre', selected: false, isCorrect: false },
                                        { display: 'Chimère', selected: false, isCorrect: false },
                                        { display: 'Manticore', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Créature'
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
                                display: 'Quel est le nom du directeur de Poudlard avant Albus Dumbledore ?',
                                picture: '/armando_dipuet.webp',
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: 'Directeurs',
                                answers: {
                                    create: [
                                        { display: 'Armando Dippet', selected: false, isCorrect: true },
                                        { display: 'Phineas Nigellus Black', selected: false, isCorrect: false },
                                        { display: 'Gellert Grindelwald', selected: false, isCorrect: false },
                                        { display: 'Horace Slughorn', selected: false, isCorrect: false }
                                    ]
                                },
                                labels: {
                                    create: [
                                        {
                                            label: {
                                                create: {
                                                    display: 'Directeur'
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

export default defineEventHandler(async (event) => {
    // Suppression des anciennes données
    await prisma.questionLabel.deleteMany({});
    await prisma.quizQuestion.deleteMany({});
    await prisma.answer.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.label.deleteMany({});
    await prisma.playerAnswer.deleteMany({});
    await prisma.playerGame.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.quiz.deleteMany({});


    const quizzesDatas = [
        {
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
                                        { display: 'Harry James Potter', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Gryffindor', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Albus Dumbledore', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Regulus Black', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Attrapeur', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'La Pierre Philosophale', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Expecto Patronum', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Arthur', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Gobelin', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Fourchelang', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Cape d\'invisibilité', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Helga Poufsouffle', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Kreacher', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Ollivanders', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Basilic', selected: false, isCorrect: true, selected: false },
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
                                        { display: 'Armando Dippet', selected: false, isCorrect: true, selected: false },
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
        },
        {
            display: "Quiz sur la Bretagne",
            questions: {
                create: [
                    {
                        question: {
                            create: {
                                display: "Quel est le nom de la capitale de la Bretagne ?",
                                picture: "/nope.webp", // URL de l'image si nécessaire
                                questionDuration: 2, // durée en secondes
                                answerDuration: 5, // durée en secondes
                                theme: "Géographie",
                                answers: {
                                    create: [
                                        { display: "Rennes", isCorrect: true, selected: false },
                                        { display: "Nantes", isCorrect: false, selected: false },
                                        { display: "Brest", isCorrect: false, selected: false },
                                        { display: "Quimper", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le nom du célèbre festival de musique bretonne qui se déroule à Lorient ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Culture",
                                answers: {
                                    create: [
                                        { display: "Fest-Noz", isCorrect: false, selected: false },
                                        { display: "Festival Interceltique", isCorrect: true, selected: false },
                                        { display: "Festival de la Saint-Yves", isCorrect: false, selected: false },
                                        { display: "Festival de la Mer", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le principal fleuve de Bretagne ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Géographie",
                                answers: {
                                    create: [
                                        { display: "La Loire", isCorrect: false, selected: false },
                                        { display: "La Vilaine", isCorrect: true, selected: false },
                                        { display: "Le Rance", isCorrect: false, selected: false },
                                        { display: "Le Blavet", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le nom du célèbre menhir situé à Carnac ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Histoire",
                                answers: {
                                    create: [
                                        { display: "Menhir de la Pierre Longue", isCorrect: false, selected: false },
                                        { display: "Menhir de Kerloas", isCorrect: true, selected: false },
                                        { display: "Menhir de Kermario", isCorrect: false, selected: false },
                                        { display: "Menhir de Saint-Barbe", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le plat traditionnel breton à base de galette de sarrasin souvent servi avec divers garnitures ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Gastronomie",
                                answers: {
                                    create: [
                                        { display: "Crêpe", isCorrect: false, selected: false },
                                        { display: "Galette", isCorrect: true, selected: false },
                                        { display: "Kouign-amann", isCorrect: false, selected: false },
                                        { display: "Far breton", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le nom du poète et écrivain breton connu pour son œuvre en langue bretonne ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Littérature",
                                answers: {
                                    create: [
                                        { display: "René Ghil", isCorrect: false, selected: false },
                                        { display: "Yvan Goll", isCorrect: false, selected: false },
                                        { display: "Paul Fort", isCorrect: false, selected: false },
                                        { display: "Roparz Hemon", isCorrect: true, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le nom de la baie célèbre pour ses marées extraordinaires, située en Bretagne ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Géographie",
                                answers: {
                                    create: [
                                        { display: "Baie de Douarnenez", isCorrect: false, selected: false },
                                        { display: "Baie de Morlaix", isCorrect: false, selected: false },
                                        { display: "Baie du Mont-Saint-Michel", isCorrect: true, selected: false },
                                        { display: "Baie de Quiberon", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est l'élément emblématique de la Bretagne que l’on retrouve sur son drapeau ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Symbole",
                                answers: {
                                    create: [
                                        { display: "La croix de Saint-George", isCorrect: false, selected: false },
                                        { display: "Les hermines", isCorrect: true, selected: false },
                                        { display: "Le triskel", isCorrect: false, selected: false },
                                        { display: "La fleur de lys", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le nom du château médiéval situé à Fougères, un des plus grands châteaux fortifiés d’Europe ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Histoire",
                                answers: {
                                    create: [
                                        { display: "Château de Josselin", isCorrect: false, selected: false },
                                        { display: "Château de Clisson", isCorrect: false, selected: false },
                                        { display: "Château de Fougeres", isCorrect: true, selected: false },
                                        { display: "Château de Vitré", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                    {
                        question: {
                            create: {
                                display: "Quel est le nom de la langue celtique traditionnelle parlée en Bretagne ?",
                                picture: "/nope.webp",
                                questionDuration: 2,
                                answerDuration: 5,
                                theme: "Langue",
                                answers: {
                                    create: [
                                        { display: "Le gaélique", isCorrect: false, selected: false },
                                        { display: "Le gallois", isCorrect: false, selected: false },
                                        { display: "Le breton", isCorrect: true, selected: false },
                                        { display: "Le cornique", isCorrect: false, selected: false },
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
        }
    ]

    // Création des nouvelles données

    const promises = quizzesDatas.map(data => {
        return prisma.quiz.create({ data })
    })
    return await Promise.all(promises);
});

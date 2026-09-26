import type { Subject } from "@/lib/validation/schemas";

// Topics are grouped for practice. They follow common SHS/WASSCE study areas
// but are not a reproduction of the official WAEC syllabus.
export const subjects: Subject[] = [
  {
    id: "mathematics",
    slug: "mathematics",
    name: "Mathematics",
    description: "Number, algebra, geometry, mensuration, statistics, probability and trigonometry.",
    icon: "📐",
    published: true,
    intro: [
      "Core Mathematics rewards steady practice more than any other subject. Most marks come from applying a small set of methods accurately: simplifying, solving equations, using formulas and reading data.",
      "Practise one topic at a time until the methods feel automatic, then use mixed practice to get used to switching between topics the way an exam paper does.",
    ],
    studyTips: [
      "Write out every step. Careless slips are easier to spot when your working is clear.",
      "Keep a formula sheet for mensuration and trigonometry and test yourself on it without looking.",
      "Use the value of π the question tells you to use (for example 22/7 or 3.142).",
      "After each practice session, redo every question you got wrong before moving on.",
    ],
    topics: [
      { id: "number", slug: "number", name: "Number and Numeration", description: "Fractions, standard form, number bases, indices, logarithms and percentages.", published: true },
      { id: "algebra", slug: "algebra", name: "Algebra", description: "Linear and quadratic equations, factorisation, change of subject and functions.", published: true },
      { id: "geometry", slug: "geometry", name: "Geometry", description: "Angles, polygons, triangles, circles and Pythagoras' theorem.", published: true },
      { id: "mensuration", slug: "mensuration", name: "Mensuration", description: "Perimeter, area, surface area and volume of plane shapes and solids.", published: true },
      { id: "statistics", slug: "statistics", name: "Statistics", description: "Mean, median, mode, range and pie charts.", published: true },
      { id: "probability", slug: "probability", name: "Probability", description: "Simple and combined events with coins, dice, cards and bags of counters.", published: true },
      { id: "trigonometry", slug: "trigonometry", name: "Trigonometry", description: "Sine, cosine, tangent, special angles and right-angled triangle problems.", published: true },
    ],
  },
  {
    id: "english",
    slug: "english",
    name: "English Language",
    description: "Concord, tenses, vocabulary, prepositions, idioms and spelling.",
    icon: "📖",
    published: true,
    intro: [
      "English Language underpins every other paper you write. Objective questions test grammar and vocabulary directly, and the same skills decide how clearly you express yourself in essays and comprehension answers.",
      "Short, frequent practice works best: a few questions a day on concord, tenses and vocabulary builds instinct faster than occasional long sessions.",
    ],
    studyTips: [
      "Read the whole sentence before choosing an option. The clue to the right answer is often at the end.",
      "Keep a notebook of new words with a synonym, an antonym and an example sentence for each.",
      "Learn the rule behind each concord mistake you make, not just the correct answer.",
      "Read good English every day: newspapers, novels and well-edited websites.",
    ],
    topics: [
      { id: "concord", slug: "concord", name: "Concord", description: "Subject–verb agreement, including tricky subjects such as 'each', 'neither…nor' and collective nouns.", published: true },
      { id: "tenses", slug: "tenses", name: "Tenses", description: "Choosing the correct verb form for time, sequence and conditional sentences.", published: true },
      { id: "synonyms", slug: "synonyms", name: "Synonyms", description: "Words closest in meaning to a given word in context.", published: true },
      { id: "antonyms", slug: "antonyms", name: "Antonyms", description: "Words opposite in meaning to a given word in context.", published: true },
      { id: "prepositions", slug: "prepositions", name: "Prepositions", description: "Fixed prepositions after verbs, adjectives and nouns.", published: true },
      { id: "idioms", slug: "idioms", name: "Idioms", description: "Common idiomatic expressions and what they mean.", published: true },
      { id: "spelling", slug: "spelling", name: "Spelling", description: "Commonly misspelt English words.", published: true },
    ],
  },
  {
    id: "integrated-science",
    slug: "integrated-science",
    name: "Integrated Science",
    description: "Living things, the human body, matter, energy, ecosystems and forces.",
    icon: "🔬",
    published: true,
    intro: [
      "Integrated Science covers biology, chemistry, physics and agricultural science ideas in one subject. Many questions test whether you understand a definition precisely or can apply a simple relationship.",
      "Learn key terms exactly, connect them to everyday examples from home and school, and practise short calculations until they are routine.",
    ],
    studyTips: [
      "Make flashcards for definitions (for example photosynthesis, sublimation, mutualism) and review them often.",
      "Draw and label diagrams from memory: cells, the heart, food chains.",
      "For calculations, always write the formula, substitute values, then include the unit in your answer.",
      "Link topics to real life: the Akosombo Dam for energy, malaria for disease transmission, cocoa farms for ecosystems.",
    ],
    topics: [
      { id: "living-things", slug: "living-things", name: "Cells and Living Things", description: "Cell structure, characteristics of living things and photosynthesis.", published: true },
      { id: "human-body", slug: "human-body", name: "The Human Body", description: "Circulation, digestion, breathing, excretion, nutrition and disease.", published: true },
      { id: "matter", slug: "matter", name: "Matter", description: "States of matter, elements and compounds, physical and chemical changes, acids and bases.", published: true },
      { id: "energy", slug: "energy", name: "Energy", description: "Forms of energy, energy conversion, heat transfer and energy sources.", published: true },
      { id: "ecosystems", slug: "ecosystems", name: "Ecosystems", description: "Food chains, producers and consumers, decomposers and relationships between organisms.", published: true },
      { id: "forces", slug: "forces", name: "Forces and Motion", description: "Force, weight, friction, speed and simple machines.", published: true },
    ],
  },
  {
    id: "social-studies",
    slug: "social-studies",
    name: "Social Studies",
    description: "Environment, governance, socialisation, citizenship and development.",
    icon: "🌍",
    published: true,
    intro: [
      "Social Studies asks you to understand how people, society, government and the environment interact, with a strong focus on Ghana.",
      "Objective questions often test key concepts and facts, while essay questions expect you to explain causes, effects and solutions with relevant Ghanaian examples.",
    ],
    studyTips: [
      "For every issue (for example deforestation or galamsey), learn causes, effects and at least three solutions.",
      "Use current Ghanaian examples in essays, but make sure your facts are accurate.",
      "Learn key definitions word for word: socialisation, rule of law, patriotism, human resources.",
      "Practise planning essay answers in bullet points before writing them in full.",
    ],
    topics: [
      { id: "environment", slug: "environment", name: "Our Environment", description: "The physical and social environment, environmental problems and conservation.", published: true },
      { id: "governance", slug: "governance", name: "Governance and the Constitution", description: "Arms of government, rule of law, separation of powers and Ghana's constitutional history.", published: true },
      { id: "socialisation", slug: "socialisation", name: "Socialisation and the Family", description: "Agents of socialisation, family types and their roles.", published: true },
      { id: "citizenship", slug: "citizenship", name: "Citizenship and Rights", description: "Rights and responsibilities of citizens, patriotism and civic duties.", published: true },
      { id: "development", slug: "development", name: "Development and Cooperation", description: "Resources, human development and regional and continental organisations.", published: true },
    ],
  },
];

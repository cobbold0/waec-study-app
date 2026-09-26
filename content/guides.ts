export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type Guide = {
  slug: string;
  navTitle: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string[];
  sections: GuideSection[];
  relatedSubjects: string[];
  relatedGuides: string[];
};

const officialNote =
  "Exam formats, syllabuses and timetables can change. Always confirm current details with your school and the official WAEC Ghana website.";

export const guides: Guide[] = [
  {
    slug: "waec-study",
    navTitle: "How to prepare for WAEC",
    title: "How to Prepare for WAEC: A Practical Study Plan",
    metaTitle: "How to Prepare for WAEC (WASSCE) — A Practical Study Plan",
    description:
      "A simple, step-by-step plan for preparing for WAEC exams in Ghana: find your weak topics, build a timetable, practise questions and review mistakes.",
    intro: [
      "Good WAEC preparation is not about studying for the longest hours. It is about practising the right things regularly, finding out what you do not know yet, and fixing it before exam day.",
      "This guide gives you a plan you can start today, whether your exams are a year away or a few weeks away.",
    ],
    sections: [
      {
        heading: "1. Find out where you stand",
        paragraphs: [
          "Before making a timetable, take a short practice session in each subject. Your score matters less than the pattern: which topics do you get right easily, and which ones keep tripping you up?",
          "Write down your three weakest topics for each subject. These deserve most of your study time.",
        ],
      },
      {
        heading: "2. Build a realistic timetable",
        paragraphs: [
          "A timetable you can actually follow beats an ambitious one you abandon after a week.",
        ],
        list: [
          "Study in blocks of 30–50 minutes with short breaks.",
          "Cover your core subjects (English, Mathematics, Integrated Science, Social Studies) every week.",
          "Put your weakest topics at the times you concentrate best.",
          "Leave one session a week free to catch up on anything you missed.",
        ],
      },
      {
        heading: "3. Practise actively, not passively",
        paragraphs: [
          "Reading notes over and over feels productive, but testing yourself is far more effective. Answering questions forces you to recall information, which is what the exam will ask you to do.",
          "After each question, check the explanation, even when you got it right. Make sure you know why the answer is correct, not just that it is.",
        ],
      },
      {
        heading: "4. Review your mistakes",
        paragraphs: [
          "Every wrong answer shows you exactly what to study next. Keep a mistakes notebook: write the question, the correct answer and the rule or idea you missed. Read it before each study session.",
        ],
      },
      {
        heading: "5. Practise under time pressure",
        paragraphs: [
          "As the exam gets closer, practise with a timer. This builds speed and shows you where you lose time. Our timed practice mode gives you one minute per question.",
          officialNote,
        ],
      },
    ],
    relatedSubjects: ["mathematics", "english", "integrated-science", "social-studies"],
    relatedGuides: ["waec-study-tips", "waec-practice-questions"],
  },
  {
    slug: "waec-practice-questions",
    navTitle: "WAEC practice questions",
    title: "WAEC Practice Questions with Instant Explanations",
    metaTitle: "Free WAEC Practice Questions with Explanations",
    description:
      "Practise free WAEC-style questions in Mathematics, English, Integrated Science and Social Studies. Get instant feedback and an explanation for every answer.",
    intro: [
      "Practice questions are the fastest way to find out what you know and what you still need to learn. Every question on this site comes with an explanation, so a wrong answer becomes a lesson instead of a guess.",
    ],
    sections: [
      {
        heading: "What kind of questions are these?",
        paragraphs: [
          "Our questions are original practice questions written to cover topics commonly studied for WAEC exams in Ghana. They are not official WAEC past questions, and we label them clearly as original.",
          "Using original questions means we can explain every answer in full and add questions for the topics students find hardest.",
        ],
      },
      {
        heading: "How to get the most from practice questions",
        list: [
          "Start with topic practice to master one area at a time.",
          "Move to mixed practice once you are comfortable, because real exams mix topics together.",
          "Read every explanation, including for questions you answered correctly.",
          "Use your progress page to find weak topics, then practise those first.",
          "Try timed practice in the weeks before your exam to build speed.",
        ],
      },
      {
        heading: "Should I also use past papers?",
        paragraphs: [
          "Yes. Official past papers show you the exact style and difficulty of real questions. Use them alongside topic practice: practise topics here to fix weaknesses, then test yourself with past papers from your school or other legitimate sources.",
        ],
      },
    ],
    relatedSubjects: ["mathematics", "english", "integrated-science", "social-studies"],
    relatedGuides: ["waec-study", "waec-mathematics", "waec-english"],
  },
  {
    slug: "waec-mathematics",
    navTitle: "WAEC Mathematics guide",
    title: "How to Prepare for WAEC Mathematics",
    metaTitle: "How to Prepare for WAEC Core Mathematics — Study Guide",
    description:
      "Practical tips for WAEC Core Mathematics: master the key topics, show your working, avoid careless errors and practise with instant explanations.",
    intro: [
      "Mathematics is a skill subject: you get better by doing, not by reading. The good news is that most questions rely on a limited set of methods you can master with steady practice.",
    ],
    sections: [
      {
        heading: "Master the foundations first",
        paragraphs: [
          "Fractions, indices, simplifying expressions and solving equations appear inside questions from almost every topic. If these are shaky, everything else feels harder. Spend your first weeks making them automatic.",
        ],
      },
      {
        heading: "Topics to practise",
        list: [
          "Number and numeration: standard form, number bases, fractions, indices and logarithms, percentages.",
          "Algebra: linear and quadratic equations, factorisation, simultaneous equations, change of subject.",
          "Geometry: angles, polygons, triangles, circle theorems, Pythagoras' theorem.",
          "Mensuration: perimeter, area, surface area and volume.",
          "Statistics and probability: mean, median, mode, pie charts, simple probability.",
          "Trigonometry: sine, cosine, tangent and special angles.",
        ],
      },
      {
        heading: "Avoid careless mistakes",
        list: [
          "Write each step on a new line so errors are easy to spot.",
          "Watch negative signs, especially when squaring: (−3)² = 9.",
          "Use the value of π given in the question.",
          "Include units in your final answer (cm², m³, GH₵).",
          "If you have time, check your answer by substituting it back.",
        ],
      },
      {
        heading: "Practise, then review",
        paragraphs: [
          "Do a short topic session, read every explanation, and redo the questions you got wrong the next day. Repeating this cycle is one of the most reliable ways to improve your Mathematics.",
          officialNote,
        ],
      },
    ],
    relatedSubjects: ["mathematics"],
    relatedGuides: ["waec-study-tips", "waec-study"],
  },
  {
    slug: "waec-english",
    navTitle: "WAEC English guide",
    title: "How to Prepare for WAEC English Language",
    metaTitle: "How to Prepare for WAEC English Language — Study Guide",
    description:
      "Improve your WAEC English Language with focused practice on concord, tenses, vocabulary, prepositions, idioms and spelling, plus reading and writing tips.",
    intro: [
      "English Language is a core subject, and the grammar and vocabulary you build here help you express yourself in every other paper too.",
    ],
    sections: [
      {
        heading: "Grammar: learn the rules behind your mistakes",
        paragraphs: [
          "Concord (subject–verb agreement) and tenses cause many lost marks. When you get one wrong, find the rule. For example, 'each', 'everyone' and 'neither of' take singular verbs, and 'news' and 'Mathematics' are singular.",
        ],
      },
      {
        heading: "Vocabulary: build it every day",
        list: [
          "Learn a few new words daily and write each one in a sentence.",
          "For each word, note one synonym and one antonym.",
          "Pay attention to context: many words change meaning depending on the sentence.",
          "Learn common idioms such as 'to bury the hatchet' or 'once in a blue moon'.",
        ],
      },
      {
        heading: "Reading and comprehension",
        paragraphs: [
          "Read regularly: newspapers, novels and well-written articles. After reading, summarise the main idea in one or two sentences. This trains the skills comprehension and summary questions test.",
        ],
      },
      {
        heading: "Writing",
        paragraphs: [
          "Practise essays and letters with a plan: introduction, clear paragraphs with one idea each, and a conclusion. Check your concord, tenses, spelling and punctuation before finishing.",
          officialNote,
        ],
      },
    ],
    relatedSubjects: ["english"],
    relatedGuides: ["waec-study-tips", "waec-study"],
  },
  {
    slug: "waec-study-tips",
    navTitle: "WAEC study tips",
    title: "WAEC Study Tips That Actually Work",
    metaTitle: "WAEC Study Tips That Actually Work",
    description:
      "Evidence-based study tips for WAEC students: active recall, spaced practice, mixing topics, sleep and a calm exam-day routine.",
    intro: [
      "Many students study hard but not smart. These techniques are backed by research on how people learn, and they work for every subject.",
    ],
    sections: [
      {
        heading: "Test yourself (active recall)",
        paragraphs: [
          "Instead of rereading notes, close the book and try to recall the ideas, or answer practice questions. Retrieving information strengthens memory much more than reviewing it.",
        ],
      },
      {
        heading: "Space out your practice",
        paragraphs: [
          "Studying a topic for 20 minutes on three different days works better than one hour on a single day. Come back to topics you practised last week so you do not forget them.",
        ],
      },
      {
        heading: "Mix topics once you know the basics",
        paragraphs: [
          "Practising one topic at a time is good for learning a method. Mixing topics teaches you to recognise which method a question needs, which is exactly what exams require.",
        ],
      },
      {
        heading: "Focus on weak areas",
        paragraphs: [
          "It is tempting to keep practising what you are already good at. Use your progress page to find topics with low accuracy and give them extra time.",
        ],
      },
      {
        heading: "Look after yourself",
        list: [
          "Sleep well, especially the night before a paper. Sleep helps your brain store what you learned.",
          "Take short breaks to stay focused.",
          "Eat properly and drink water.",
          "Study with friends occasionally: explaining a topic to someone else is a great test of understanding.",
        ],
      },
      {
        heading: "On exam day",
        list: [
          "Read every question carefully before answering.",
          "Answer the questions you are sure of first, then return to harder ones.",
          "Keep an eye on the time.",
          "Follow every instruction from your invigilators and on the question paper.",
        ],
      },
    ],
    relatedSubjects: ["mathematics", "english", "integrated-science", "social-studies"],
    relatedGuides: ["waec-study", "waec-practice-questions"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

import type { LearningJourney, LessonContent } from '../types';

const sourceRoot = 'https://heritage.iitk.ac.in/SBG';

export const journeys: LearningJourney[] = [
  {
    id: 'art-of-action',
    title: 'Understanding the Art of Action',
    subtitle: 'A three-lesson path through Karma Yoga',
    description: 'Explore how to act with responsibility, meet outcomes with steadiness, and bring discernment to the work in front of you.',
    topic: 'Action & responsibility',
    lessonIds: ['agency-and-action', 'steadiness-in-outcomes', 'skillful-action'],
    lessons: 3,
    totalMinutes: 18,
    learningOutcomes: [
      'Separate responsible effort from outcomes you cannot fully control.',
      'Respond to success and difficulty without losing your balance.',
      'Bring discernment and care to the quality of your actions.',
    ],
  },
];

export const lessons: LessonContent[] = [
  {
    id: 'agency-and-action',
    journeyId: 'art-of-action',
    title: 'Put Your Attention Where Your Agency Is',
    source: 'Bhagavad Gītā · 2.47',
    description: 'Understand the distinction between your responsibility to act and your limited control over results.',
    minutes: 6,
    topic: 'Agency & action',
    reference: {
      work: 'Bhagavad Gītā',
      chapter: 2,
      verse: 47,
      sourceUrl: `${sourceRoot}/2.47`,
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
      transliteration: 'karmaṇy evādhikāras te mā phaleṣu kadācana |\nmā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi ||',
      editorialRendering: 'Your sphere of agency is in action, not in command of its fruits. Do not make the result your sole motive, and do not become attached to inaction.',
      renderingNote: 'NITYA editorial rendering from the Sanskrit. It is a fresh working translation, not a quotation from a published English edition. The archive presents several translations and commentarial traditions; their wording and doctrinal emphasis differ.',
    },
    discover: {
      context: 'In this verse, Kṛṣṇa addresses Arjuna on the relation between action and its fruits. The final line matters as much as the first: the teaching also cautions against becoming attached to inaction.',
      invitation: 'Think of a task that matters to you. Notice how much of your attention goes to doing the task and how much goes to imagining the result.',
    },
    understand: {
      teaching: 'Take responsibility for the action that is yours to take. Do not confuse that responsibility with control over every consequence.',
      explanation: [
        'Adhikāra points to one’s sphere of right, authority or responsibility. The verse directs attention to action rather than claiming ownership over its fruits.',
        'It also warns against making reward the only reason to act. This is not a command to stop caring about outcomes; outcomes can still inform learning, accountability and the next decision.',
        'The closing phrase rejects attachment to inaction. Uncertainty about results is not, by itself, a reason to abandon a necessary or worthwhile action.',
      ],
      modernExampleTitle: 'Preparing for an interview',
      modernExample: 'You can prepare carefully, practise explaining your work, arrive on time and answer honestly. You cannot control the applicant pool or the final hiring decision. Use the result as information, but do not let it erase the value of the preparation you were responsible for.',
      nuance: 'This is a practical reading for everyday choices, not a complete account of the Gītā’s teachings on karma, duty or liberation. The meaning of duty is shaped by the wider text and its interpretive traditions.',
    },
    practise: {
      whatToDo: 'Choose one meaningful task you can take a step on today. Write two short lines: “What is mine to do?” and “What is not fully in my control?” Then spend at least 15 focused minutes doing the first concrete action.',
      whatToObserve: 'Notice when your attention moves from the next useful action to imagined praise, rejection, success or failure. Gently bring it back to the step you chose.',
      whatToLearn: 'Learn to distinguish responsibility from guaranteed results. Keep caring about the quality and consequences of your work without pretending you control every outcome.',
      logLabel: 'Practised: identify my action and what is outside my control',
    },
    reflect: {
      questions: [
        'What part of the task was genuinely within your control?',
        'When did your attention move towards the result?',
        'What would responsible effort look like the next time?',
      ],
    },
  },
  {
    id: 'steadiness-in-outcomes',
    journeyId: 'art-of-action',
    title: 'Stay Steady When Outcomes Change',
    source: 'Bhagavad Gītā · 2.48',
    description: 'Explore equanimity as a way to keep responding thoughtfully in success and difficulty.',
    minutes: 6,
    topic: 'Equanimity',
    reference: {
      work: 'Bhagavad Gītā',
      chapter: 2,
      verse: 48,
      sourceUrl: `${sourceRoot}/2.48`,
      sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
      transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||',
      editorialRendering: 'Established in yoga, act while releasing attachment. Be even-minded in success and failure; this evenness is called yoga.',
      renderingNote: 'NITYA editorial rendering from the Sanskrit. It is a fresh working translation, not a quotation from a published English edition. The archive presents several translations and commentarial traditions; their wording and doctrinal emphasis differ.',
    },
    discover: {
      context: 'The previous verse directs attention towards action rather than possession of its fruits. This verse describes the quality of mind with which action is to be carried out: evenness amid success and failure.',
      invitation: 'Recall a recent moment when something went well, or did not go as planned. Notice how quickly the outcome shaped your next thought or action.',
    },
    understand: {
      teaching: 'Equanimity is the ability to stay present and responsive when circumstances shift, rather than being completely carried away by success or difficulty.',
      explanation: [
        'The verse connects yoga with samatva: evenness or balance. It does not tell Arjuna to stop acting; it begins by telling him to act.',
        'Steadiness is not emotional numbness. You can feel disappointment, celebrate good news, recognise harm and still choose a considered next response.',
        'An even mind makes room to learn from an outcome without turning one result into a final judgement about your worth or ability.',
      ],
      modernExampleTitle: 'Receiving feedback on your work',
      modernExample: 'A presentation receives praise from one person and criticism from another. Instead of becoming overconfident or giving up, separate the useful evidence from the emotional jolt. Keep what worked, investigate what did not, and choose one improvement.',
      nuance: 'Equanimity should not be used to dismiss injustice, ignore consequences or silence legitimate emotion. It is a discipline of response, not an excuse for passivity.',
    },
    practise: {
      whatToDo: 'Think of a recent outcome that affected you. Write down the event in one factual sentence, the emotion it brought up, one thing it can teach you, and one constructive next step.',
      whatToObserve: 'Notice whether you are treating the outcome as complete proof that you are capable or incapable. Notice the urge to react immediately.',
      whatToLearn: 'Practise allowing an outcome to inform you without letting it dictate your whole response. A balanced response can include celebration, grief, correction or a new attempt.',
      logLabel: 'Practised: pause and choose a balanced next response',
    },
    reflect: {
      questions: [
        'What did the outcome make you believe about yourself?',
        'Which part of your reaction was useful, and which part was automatic?',
        'What is one balanced next step you can take?',
      ],
    },
  },
  {
    id: 'skillful-action',
    journeyId: 'art-of-action',
    title: 'Bring Skill and Discernment to Action',
    source: 'Bhagavad Gītā · 2.50',
    description: 'Consider what it means to act skilfully, beyond simply moving quickly or chasing a favourable result.',
    minutes: 6,
    topic: 'Discernment',
    reference: {
      work: 'Bhagavad Gītā',
      chapter: 2,
      verse: 50,
      sourceUrl: `${sourceRoot}/2.50`,
      sanskrit: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते।\nतस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्॥',
      transliteration: 'buddhi-yukto jahātīha ubhe sukṛta-duṣkṛte |\ntasmād yogāya yujyasva yogaḥ karmasu kauśalam ||',
      editorialRendering: 'One guided by discernment moves beyond both merit and demerit here. Therefore, commit yourself to yoga: yoga is skill in action.',
      renderingNote: 'NITYA editorial rendering from the Sanskrit. It is a fresh working translation, not a quotation from a published English edition. “Skill in action” is interpreted differently across commentaries; this lesson presents one practical reading rather than claiming a single exhaustive meaning.',
    },
    discover: {
      context: 'This is a curated thematic path, not a consecutive reading of every verse in Chapter 2. We move from 2.48 to 2.50 because both speak to acting with a steady, discerning understanding.',
      contextualBridge: {
        title: 'A contextual pause — Bhagavad Gītā 2.49',
        text: 'The intervening verse develops the discussion of buddhi-yoga. Kṛṣṇa contrasts action driven by attachment to its fruits with taking refuge in buddhi. Translations and commentaries explain this in different ways: some emphasise evenness of mind, while others foreground the yoga of wisdom. Verse 2.50 then continues with the person established in buddhi and introduces the expression “skill in action”. This brief bridge makes the selection transparent without presenting our three lessons as a verse-by-verse commentary.',
        sourceUrl: `${sourceRoot}/2.49`,
      },
      invitation: 'Think about the difference between finishing something quickly and doing it well. What makes an action genuinely skilful in a situation that matters?',
    },
    understand: {
      teaching: 'Skillful action joins thoughtful judgement with steadiness. It asks not only “Did I get the result?” but also “Was this the right, careful and appropriate way to act?”',
      explanation: [
        'Buddhi refers to understanding, discernment or intelligence. In the verse, discernment is linked with acting in yoga rather than being driven only by immediate reward.',
        'Kauśalam is translated as skill or skilfulness. The commentarial material on the source page connects this skill with the evenness described in the previous verse, while different traditions explain the verse in their own theological frameworks.',
        'For this lesson, NITYA applies the idea to careful judgement: understand the purpose, consider who is affected, choose a responsible method and review what the action teaches you.',
      ],
      modernExampleTitle: 'Working with a team',
      modernExample: 'A group needs to finish a project. The quickest option may leave a teammate unclear or create avoidable errors. A more skilful response clarifies the goal, shares responsibilities, communicates a risk early and checks the quality of the result.',
      nuance: '“Skill in action” is not merely productivity, speed or a technique for guaranteeing success. The practical explanation here is an editorial application; the verse’s philosophical meaning is richer and debated across traditions.',
    },
    practise: {
      whatToDo: 'Before a task, pause and answer: “What is the purpose?”, “Who may be affected?”, and “What would a careful, responsible effort look like?” Choose one next action and carry it out with attention.',
      whatToObserve: 'Notice whether urgency, ego, habit or the desire for praise is pushing you towards a careless shortcut. Notice when a small adjustment could make the action more considerate or effective.',
      whatToLearn: 'Review the quality of the action separately from the outcome. Identify one choice that showed discernment and one thing you would refine next time.',
      logLabel: 'Practised: choose and carry out a skilful next action',
    },
    reflect: {
      questions: [
        'What made your action skilful, beyond whether it succeeded?',
        'Who else was affected by the way you acted?',
        'What would you keep or change the next time you face a similar task?',
      ],
    },
  },
];

export const topics = [...new Set(lessons.map((lesson) => lesson.topic))].map((name) => ({
  name,
  icon: ({ 'Agency & action': 'target', Equanimity: 'sun', Discernment: 'compass' } as Record<string, string>)[name] ?? 'book-open',
}));

export const sources = [...new Set(lessons.map((lesson) => lesson.reference.work))];

export const featuredLesson = lessons[0];

export function findLesson(lessonId: string | undefined): LessonContent | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function findJourney(journeyId: string | undefined): LearningJourney | undefined {
  return journeys.find((journey) => journey.id === journeyId);
}

export function getJourneyLessons(journey: LearningJourney): LessonContent[] {
  return journey.lessonIds
    .map((lessonId) => findLesson(lessonId))
    .filter((lesson): lesson is LessonContent => Boolean(lesson));
}

export type LotusStage = 'seed' | 'sprout' | 'early-bloom' | 'full-bloom' | 'radiant-bloom';
export type GrowthTab = 'journey' | 'learnings' | 'practice-log';

export interface LessonSummary {
  id: string;
  title: string;
  source: string;
  description: string;
  inAppMinutes: number;
  topic: string;
}

export interface VerseReference {
  work: string;
  chapter: number;
  verse: number;
  sourceUrl: string;
  sanskrit: string;
  transliteration: string;
  editorialRendering: string;
  renderingNote: string;
}

export interface LessonContent extends LessonSummary {
  journeyId: string;
  reference: VerseReference;
  discover: {
    context: string;
    invitation: string;
    contextualBridge?: {
      title: string;
      text: string;
      sourceUrl: string;
    };
  };
  understand: {
    teaching: string;
    explanation: string[];
    modernExampleTitle: string;
    modernExample: string;
    nuance: string;
  };
  practise: {
    whatToDo: string;
    whatToObserve: string;
    whatToLearn: string;
    logLabel: string;
  };
  reflect: {
    questions: string[];
  };
}

export interface LearningJourney {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  topic: string;
  lessonIds: string[];
  lessons: number;
  inAppMinutes: number;
  learningOutcomes: string[];
}

export interface ActivityCounts {
  lessonsExplored: number;
  practicesAttempted: number;
  journeysCompleted: number;
}

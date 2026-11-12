export type LotusStage = 'seed' | 'sprout' | 'early-bloom' | 'full-bloom' | 'radiant-bloom';
export type GrowthTab = 'journey' | 'learnings' | 'practice-log';
export interface LessonSummary { id:string; title:string; source:string; description:string; minutes:number; topic:string; }
export interface ActivityCounts { lessonsExplored:number; practicesAttempted:number; journeysCompleted:number; }

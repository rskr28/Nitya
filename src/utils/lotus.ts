import type { ActivityCounts, LotusStage } from '../types';
/**
 * MVP milestone policy: Seed is the initial stage. Sprout requires a completed
 * qualifying learning journey. Later stages remain intentionally configurable
 * until product owners define and validate their acceptance thresholds.
 * Activity counters never directly determine the lotus stage.
 */
export function getLotusStage(counts:ActivityCounts):LotusStage {
  if(counts.journeysCompleted < 1) return 'seed';
  // Later-stage thresholds are deliberately not inferred from raw counters.
  return 'sprout';
}
export const lotusStageLabels:Record<LotusStage,string>={seed:'Seed',sprout:'Sprout','early-bloom':'Early Bloom','full-bloom':'Full Bloom','radiant-bloom':'Radiant Bloom'};

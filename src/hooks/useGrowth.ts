import { useCallback, useEffect, useState } from 'react';
import { getActivityCounts, readGrowth, type GrowthState } from '../features/growth/storage';

export function useGrowth() {
  const [growth, setGrowth] = useState<GrowthState>(() => readGrowth());
  const refresh = useCallback(() => setGrowth(readGrowth()), []);
  useEffect(() => {
    window.addEventListener('storage', refresh);
    window.addEventListener('nitya:growth-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('nitya:growth-updated', refresh);
    };
  }, [refresh]);
  return { growth, counts: getActivityCounts(growth), refresh };
}

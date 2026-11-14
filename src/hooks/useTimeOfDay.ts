import { useEffect, useState } from 'react';
import { getTimePeriod, millisecondsUntilNextPeriod, type TimePeriod } from '../features/visualIdentity/timeOfDay';
export function useTimeOfDay(): TimePeriod {
  const [period, setPeriod] = useState<TimePeriod>(() => getTimePeriod(new Date()));
  useEffect(() => {
    let timeoutId = 0;
    const sync = () => {
      const now = new Date();
      setPeriod(getTimePeriod(now));
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(sync, millisecondsUntilNextPeriod(now) + 50);
    };
    const visible = () => { if (document.visibilityState === 'visible') sync(); };
    sync();
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', visible);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', visible);
    };
  }, []);
  return period;
}
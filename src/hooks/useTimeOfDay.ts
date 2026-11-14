import { useEffect, useState } from 'react';
import { assets } from '../config/assets';
import { getTimePeriod, greetingCopy, millisecondsUntilNextPeriod, type TimePeriod } from '../features/visualIdentity/timeOfDay';

export function useTimeOfDay() {
  const [period, setPeriod] = useState<TimePeriod>(() => getTimePeriod(new Date()));

  useEffect(() => {
    let timeoutId = 0;
    const sync = () => {
      const now = new Date();
      const nextPeriod = getTimePeriod(now);
      setPeriod(nextPeriod);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(sync, millisecondsUntilNextPeriod(now) + 50);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') sync();
    };

    sync();
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return {
    period,
    greeting: greetingCopy[period].title,
    supportingText: greetingCopy[period].message,
    backgroundImage: assets.landscapes[period],
  };
}

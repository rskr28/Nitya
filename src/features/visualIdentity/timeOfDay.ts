export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';
export const greetingCopy = {
  morning: { title: 'Good morning.', message: "Here's something meaningful for you today." },
  afternoon: { title: 'Good afternoon.', message: 'Take a thoughtful moment for learning and practice.' },
  evening: { title: 'Good evening.', message: 'Pause, reflect, and carry one insight into the rest of your day.' },
  night: { title: 'Good night.', message: 'End the day with a little reflection.' },
} as const;
const boundaries = [5, 12, 17, 21];
export function getTimePeriod(date: Date): TimePeriod {
  const minutes = date.getHours() * 60 + date.getMinutes();
  if (minutes >= 21 * 60 || minutes < 5 * 60) return 'night';
  if (minutes < 12 * 60) return 'morning';
  if (minutes < 17 * 60) return 'afternoon';
  return 'evening';
}
export function millisecondsUntilNextPeriod(date: Date): number {
  for (const hour of boundaries) {
    const boundary = new Date(date);
    boundary.setHours(hour, 0, 0, 0);
    if (boundary.getTime() > date.getTime()) return boundary.getTime() - date.getTime();
  }
  const nextMorning = new Date(date);
  nextMorning.setDate(nextMorning.getDate() + 1);
  nextMorning.setHours(5, 0, 0, 0);
  return nextMorning.getTime() - date.getTime();
}
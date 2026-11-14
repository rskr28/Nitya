# NITYA — Ancient Wisdom. Modern Living.

A responsive React + TypeScript prototype for learning from primary wisdom sources and applying the ideas through small, self-reported practices.

## Run locally

```bash
npm ci
npm run dev
```

## Validate

```bash
npm run typecheck
npm run test
npm run build
```

## Current content: Content 1.0

The prototype includes one complete, three-lesson learning journey:

**Understanding the Art of Action** — a curated thematic path through Bhagavad Gītā 2.47, 2.48 and 2.50, with an editorial context bridge explaining the intervening 2.49.

The journey's ~18-minute estimate is **in-app reading and guided-learning time only**. It excludes real-world exercises, which take additional time and may be completed at the learner's own pace over multiple days.

Each lesson includes:
- Original Sanskrit and IAST transliteration.
- A clearly labelled NITYA editorial rendering (not copied from a published English translation).
- Context, a plain-language explanation and a modern example.
- A specific practice with “What to do”, “What to observe” and “What to learn”.
- Optional reflection prompts.

The source verse pages link to the IIT Kanpur Heritage Bhagavad Gītā archive, which provides the Sanskrit text, word analysis, translations and commentarial material from multiple traditions:
- [Bhagavad Gītā 2.47](https://heritage.iitk.ac.in/SBG/2.47)
- [Bhagavad Gītā 2.48](https://heritage.iitk.ac.in/SBG/2.48)
- [Bhagavad Gītā 2.49 — contextual bridge](https://heritage.iitk.ac.in/SBG/2.49)
- [Bhagavad Gītā 2.50](https://heritage.iitk.ac.in/SBG/2.50)

The wording labelled “NITYA editorial rendering” is a fresh working rendering from the Sanskrit for this product. The explanations and exercises are modern editorial applications, not quotations or claims that one interpretation exhausts the tradition. Translation and commentary traditions differ, particularly in their interpretation of yoga, buddhi and kauśalam.

## Learning journey completion

A completed lesson can be reopened in read-only review mode. Review allows the learner to revisit all four stages and any saved reflection; it does not write progress, create practice records or alter rewards.

A lesson can be completed only after the learner:
1. Moves through Discover and Understand.
2. Reaches Practise and records a self-reported practice attempt.
3. Completes the Reflect step, either by saving an optional reflection or by skipping it.

A learning journey qualifies only when every lesson listed in that journey's authored `lessonIds` is completed and has a practice record. The event is idempotent: a qualifying journey is added to `journeysCompleted` once. The first completed journey unlocks Sprout. Lesson counts, practice counts and reflections alone do not unlock it.

All prototype progress is stored locally in the browser. There is no authentication, backend persistence or cross-device sync.

## Structure

- `src/components/<Component>/`: reusable UI components.
- `src/pages/`: route-level screens.
- `src/layouts/`: shared application shell.
- `src/features/`: growth, journey, practice, reflection and wisdom domain logic.
- `src/data/content.ts`: structured, editorially authored lesson and journey content.
- `src/types/`: TypeScript domain contracts.
- `tests/`: lesson flow, storage, practice, reflection and journey completion tests.

## Scope intentionally deferred

- Backend, authentication, accounts and cloud synchronisation.
- A content-management/editorial publishing system.
- Additional source traditions and learning journeys.
- Later lotus stages beyond Seed → Sprout; thresholds have not been defined.
- Notifications, preferences and logout functionality.

The frontend architecture and design system are retained from the approved frontend foundation.

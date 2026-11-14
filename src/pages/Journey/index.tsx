import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Sprout } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { findJourney, getJourneyLessons } from '../../data/content';
import { useGrowth } from '../../hooks/useGrowth';
import { getLotusStage } from '../../utils/lotus';
import LotusProgress from '../../components/LotusProgress';
import './index.css';

export default function Journey() {
  const { journeyId } = useParams();
  const journey = findJourney(journeyId);
  const { growth, counts } = useGrowth();

  if (!journey) {
    return (
      <div className="page">
        <section className="journey-detail surface">
          <span className="eyebrow">Wisdom library</span>
          <h1>We couldn't find that learning journey.</h1>
          <p>This path may have moved or is not available in the current library.</p>
          <Link className="btn" to="/explore">Browse available content <ArrowRight size={17} /></Link>
        </section>
      </div>
    );
  }

  const journeyLessons = getJourneyLessons(journey);
  const completedIds = journeyLessons
    .filter((lesson) => growth.lessonProgress[lesson.id]?.completed)
    .map((lesson) => lesson.id);
  const isComplete = growth.journeysCompleted.includes(journey.id);
  const nextLesson = journeyLessons.find((lesson) => !growth.lessonProgress[lesson.id]?.completed) ?? journeyLessons[0];
  const revisitLesson = journeyLessons.find((lesson) => growth.lessonProgress[lesson.id]?.completed) ?? journeyLessons[0];
  const primaryLesson = isComplete ? revisitLesson : nextLesson;
  const primaryLessonHref = primaryLesson
    ? `/lesson/${primaryLesson.id}${isComplete ? '?review=1' : ''}`
    : '/explore';

  return (
    <div className="page journey-page">
      <Link to="/explore" className="back-link"><ArrowLeft size={17} /> Back to Explore</Link>
      <section className="journey-hero surface">
        <div className="journey-hero__copy">
          <span className="eyebrow">A guided learning journey · Bhagavad Gītā</span>
          <h1>{journey.title}</h1>
          <p className="journey-subtitle">{journey.subtitle}</p>
          <p>{journey.description}</p>
          <div className="journey-meta">
            <span><BookOpen size={16} /> {journey.lessons} lessons</span>
            <span><Clock3 size={16} /> ~{journey.inAppMinutes} min in-app learning</span>
          </div>
          <p className="journey-time-note">This estimate covers in-app reading and guided learning only. Real-world practices take additional time; complete them at your own pace, across one or more days.</p>
          <Link className="btn" to={primaryLessonHref}>
            {isComplete ? 'Revisit a lesson' : completedIds.length ? 'Continue the journey' : 'Begin the journey'}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="journey-hero__growth">
          <LotusProgress stage={getLotusStage(counts)} />
          <span className="journey-progress-label">{completedIds.length} of {journey.lessons} lessons completed</span>
          {isComplete && <span className="journey-unlocked"><Sprout size={16} /> Sprout unlocked</span>}
        </div>
      </section>

      <section className="journey-outcomes surface">
        <h2>What this journey explores</h2>
        <div className="journey-outcomes__grid">
          {journey.learningOutcomes.map((outcome) => (
            <p key={outcome}><CheckCircle2 size={17} />{outcome}</p>
          ))}
        </div>
      </section>

      <div className="section-title">
        <h2>The three lessons</h2>
        <span className="muted">{completedIds.length}/{journey.lessons} complete</span>
      </div>
      <section className="journey-lesson-list">
        {journeyLessons.map((lesson, index) => {
          const progress = growth.lessonProgress[lesson.id];
          const complete = Boolean(progress?.completed);
          const practiced = growth.practices.some((record) => record.lessonId === lesson.id);
          return (
            <article className={`journey-lesson surface ${complete ? 'is-complete' : ''}`} key={lesson.id}>
              <span className="journey-lesson__number">{complete ? <CheckCircle2 size={20} /> : index + 1}</span>
              <div className="journey-lesson__body">
                <span className="eyebrow">{lesson.source} · ~{lesson.inAppMinutes} min in-app</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <div className="journey-lesson__status">
                  <span>{complete ? 'Lesson completed' : progress ? `In progress · ${progress.currentStep}` : 'Not started'}</span>
                  {practiced && <span>Practice attempted</span>}
                </div>
              </div>
              <Link className="journey-lesson__link" to={`/lesson/${lesson.id}${complete ? '?review=1' : ''}`} aria-label={`${complete ? 'Review' : 'Open'} lesson: ${lesson.title}`} title={complete ? 'Review completed lesson' : 'Open lesson'}>
                <ArrowRight size={18} />
              </Link>
            </article>
          );
        })}
      </section>
      <p className="journey-source-note">Source text and translation references are linked inside each lesson. NITYA's explanations and exercises are editorial applications, not quotations from the Gītā.</p>
    </div>
  );
}

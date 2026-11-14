import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Eye, Lightbulb, PencilLine, Target } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { findJourney, findLesson, getJourneyLessons } from '../../data/content';
import { readGrowth, recordLessonOpened, setLessonStep } from '../../features/growth/storage';
import { recordPractice } from '../../features/practice/service';
import { finishWithoutReflection, saveReflection } from '../../features/reflection/service';
import type { LessonProgress } from '../../features/growth/storage';
import { useGrowth } from '../../hooks/useGrowth';
import { resolveLessonEntry } from '../../features/wisdom/lessonView.ts';
import { notify } from '../../utils/toast';
import './index.css';

type Step = Exclude<LessonProgress['currentStep'], 'complete'>;
const steps: Step[] = ['discover', 'understand', 'practise', 'reflect'];
const labels = ['Discover', 'Understand', 'Practise', 'Reflect'];

export default function Lesson() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const reviewRequested = searchParams.get('review') === '1';
  const lesson = findLesson(lessonId);
  const [step, setStep] = useState<LessonProgress['currentStep']>('discover');
  const [reviewMode, setReviewMode] = useState(false);
  const [reflection, setReflection] = useState('');
  const { growth } = useGrowth();

  useEffect(() => {
    if (!lesson) return;
    try {
      const existing = readGrowth();
      const savedProgress = existing.lessonProgress[lesson.id];
      const entry = resolveLessonEntry(savedProgress, reviewRequested || Boolean(savedProgress?.completed));

      if (entry.mode === 'review') {
        // A completed lesson opens from existing data only. Review must never write progress.
        setReviewMode(true);
        setStep('discover');
        setReflection(existing.reflections.find((item) => item.lessonId === lesson.id)?.text ?? '');
        return;
      }

      setReviewMode(false);
      const state = recordLessonOpened(lesson);
      const saved = state.lessonProgress[lesson.id];
      setStep(saved?.completed ? 'complete' : saved?.currentStep ?? 'discover');
      setReflection(state.reflections.find((item) => item.lessonId === lesson.id)?.text ?? '');
    } catch {
      notify('Progress could not be saved in this browser. Check your storage settings.', 'error');
    }
  }, [lesson, reviewRequested]);

  if (!lesson) {
    return (
      <div className="page">
        <section className="lesson-shell surface lesson-not-found">
          <span className="eyebrow">Wisdom library</span>
          <h1>We couldn't find that lesson.</h1>
          <p>The link may be outdated, or this lesson hasn't been added to the library yet.</p>
          <Link className="btn" to="/explore">Browse available lessons <ArrowRight size={17} /></Link>
        </section>
      </div>
    );
  }

  const journey = findJourney(lesson.journeyId);
  const journeyLessons = journey ? getJourneyLessons(journey) : [];
  const currentJourneyIndex = journeyLessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = journeyLessons[currentJourneyIndex + 1];
  const journeyComplete = Boolean(journey && growth.journeysCompleted.includes(journey.id));
  const index = step === 'complete' ? 4 : steps.indexOf(step);

  const changeStep = (nextStep: Step) => {
    if (reviewMode) {
      setStep(nextStep);
      return;
    }
    try {
      const state = setLessonStep(lesson.id, nextStep);
      const saved = state.lessonProgress[lesson.id];
      if (saved) setStep(saved.currentStep);
    } catch {
      notify('Progress could not be saved in this browser. Check your storage settings.', 'error');
    }
  };
  const continueLesson = () => {
    const nextStep = steps[Math.min(index + 1, steps.length - 1)];
    changeStep(nextStep);
  };
  const markPractised = () => {
    if (reviewMode) return;
    try {
      const record = recordPractice(lesson, lesson.practise.logLabel);
      if (!record) throw new Error('Practice stage was not saved');
      setStep('reflect');
      notify('Practice attempt added to your Practice Log.');
    } catch {
      notify('We could not save your practice on this device. Please try again.', 'error');
    }
  };
  const finish = (withReflection: boolean) => {
    if (reviewMode) return;
    try {
      const completed = withReflection
        ? saveReflection(lesson.id, lesson.title, reflection)
        : finishWithoutReflection(lesson.id);
      if (!completed) throw new Error('Lesson completion was not saved');
      setStep('complete');
      notify(withReflection ? 'Reflection saved. Your lesson is complete.' : 'Lesson completed without a reflection.');
    } catch {
      notify('We could not save your completion on this device. Please try again.', 'error');
    }
  };

  if (step === 'complete') {
    return (
      <div className="page lesson-page">
        <Link to={journey ? `/journey/${journey.id}` : '/explore'} className="back-link">
          <ArrowLeft size={17} /> Back to learning journey
        </Link>
        <section className="lesson-shell surface lesson-completion">
          <span className="completion-mark"><CheckCircle2 size={34} /></span>
          <span className="eyebrow">{journeyComplete ? 'Learning journey complete' : 'A moment well spent'}</span>
          <h1>{journeyComplete ? 'You completed the learning journey.' : 'You completed this lesson.'}</h1>
          <p>{journeyComplete
            ? 'You have completed every required lesson and recorded a practice attempt for each one. The first journey milestone is now unlocked.'
            : nextLesson
              ? 'You explored the teaching and attempted its practice. Continue to the next lesson when you are ready.'
              : 'You explored the teaching, attempted the practice and completed the lesson in your own way.'}</p>
          <div className="completion-summary">
            <strong>{lesson.title}</strong>
            <span>{lesson.source}</span>
            <span>{reflection.trim() ? 'Reflection saved on this device' : 'Completed without a reflection'}</span>
          </div>
          <div className="reflection-actions">
            {nextLesson && !journeyComplete && (
              <Link className="btn" to={`/lesson/${nextLesson.id}`}>Next lesson <ArrowRight size={17} /></Link>
            )}
            {journey && <Link className="btn btn-secondary" to={`/journey/${journey.id}`}>View journey progress</Link>}
            <Link className="btn btn-secondary" to="/growth">My Growth</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page lesson-page">
      <Link to={journey ? `/journey/${journey.id}` : '/explore'} className="back-link">
        <ArrowLeft size={17} /> Back to {journey ? 'Journey' : 'Explore'}
      </Link>
      <section className="lesson-shell surface">
        {reviewMode && (
          <div className="lesson-review-banner" role="status">
            <BookOpen size={17} />
            <span><strong>Read-only review</strong> · You can revisit every stage. No practice, reflection or progress will be recorded.</span>
          </div>
        )}
        <div className="lesson-top">
          <span className="eyebrow">{lesson.source}</span>
          <span className="lesson-time">~{lesson.inAppMinutes} min in-app learning · real-world practice takes additional time</span>
        </div>
        <div className="lesson-steps" aria-label="Lesson progress">
          {steps.map((currentStep, stepIndex) => (
            <button
              key={currentStep}
              type="button"
              disabled={!reviewMode && stepIndex > index}
              onClick={() => reviewMode ? setStep(currentStep) : changeStep(currentStep)}
              className={step === currentStep ? 'is-active' : stepIndex < index ? 'is-done' : 'is-locked'}
              aria-current={step === currentStep ? 'step' : undefined}
            >
              <span>{stepIndex < index ? <CheckCircle2 size={14} /> : stepIndex + 1}</span>
              {labels[stepIndex]}
              {currentStep === 'reflect' && <small>Optional</small>}
            </button>
          ))}
        </div>

        <div className="lesson-content">
          {step === 'discover' && (
            <>
              <span className="tag"><BookOpen size={14} /> Discover</span>
              <h1>{lesson.title}</h1>
              <p className="lesson-source">{lesson.description}</p>
              <div className="lesson-context">
                <h3>Where this teaching appears</h3>
                <p>{lesson.discover.context}</p>
                <p>{lesson.discover.invitation}</p>
              </div>
              {lesson.discover.contextualBridge && (
                <aside className="lesson-contextual-bridge">
                  <span className="eyebrow">Context for this curated selection</span>
                  <h3>{lesson.discover.contextualBridge.title}</h3>
                  <p>{lesson.discover.contextualBridge.text}</p>
                  <a className="source-link" href={lesson.discover.contextualBridge.sourceUrl} target="_blank" rel="noreferrer">
                    Read Bhagavad Gītā 2.49 in the IIT Kanpur Heritage archive <ArrowRight size={14} />
                  </a>
                </aside>
              )}
              <section className="verse-card" aria-label="Original verse and editorial rendering">
                <span className="eyebrow">Bhagavad Gītā · {lesson.reference.chapter}.{lesson.reference.verse}</span>
                <h3>Original Sanskrit</h3>
                <p className="verse-sanskrit">{lesson.reference.sanskrit}</p>
                <h3>Transliteration</h3>
                <p className="verse-transliteration">{lesson.reference.transliteration}</p>
                <h3>NITYA editorial rendering</h3>
                <blockquote>{lesson.reference.editorialRendering}</blockquote>
                <p className="verse-note">{lesson.reference.renderingNote}</p>
                <a className="source-link" href={lesson.reference.sourceUrl} target="_blank" rel="noreferrer">
                  Read the verse, translations and commentaries in the IIT Kanpur Heritage archive <ArrowRight size={14} />
                </a>
              </section>
            </>
          )}
          {step === 'understand' && (
            <>
              <span className="tag"><BookOpen size={14} /> Understand</span>
              <h1>{lesson.understand.teaching}</h1>
              {lesson.understand.explanation.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
              <div className="modern-example">
                <span className="eyebrow">A modern-day example</span>
                <h3>{lesson.understand.modernExampleTitle}</h3>
                <p>{lesson.understand.modernExample}</p>
              </div>
              <p className="interpretation-note"><strong>A note on interpretation:</strong> {lesson.understand.nuance}</p>
            </>
          )}
          {step === 'practise' && (
            <>
              <span className="tag"><Target size={14} /> {reviewMode ? 'Practise · Review' : 'Practise'}</span>
              <h1>Bring the teaching into today</h1>
              <div className="practice-block">
                <h3><CheckCircle2 /> What to do</h3>
                <p>{lesson.practise.whatToDo}</p>
              </div>
              <div className="practice-block">
                <h3><Eye /> What to observe</h3>
                <p>{lesson.practise.whatToObserve}</p>
              </div>
              <div className="practice-block">
                <h3><Lightbulb /> What to learn</h3>
                <p>{lesson.practise.whatToLearn}</p>
              </div>
              {reviewMode ? (
                <p className="lesson-readonly-note">Read-only review: this completed practice is shown for reference. Opening it again will not create another practice attempt.</p>
              ) : (
                <>
                  <button className="btn" type="button" onClick={markPractised}>I attempted this practice <ArrowRight size={17} /></button>
                  <small className="muted practice-disclaimer">This is self-reported. NITYA does not ask you to prove that you practised.</small>
                </>
              )}
            </>
          )}
          {step === 'reflect' && (
            <>
              <span className="tag"><PencilLine size={14} /> Reflect · Optional</span>
              <h1>What did you notice?</h1>
              <p>Reflection is optional. Your lesson can be completed with or without saving a response.</p>
              <div className="reflection-prompts">
                {lesson.reflect.questions.map((question, questionIndex) => (
                  <p key={questionIndex}><span>{questionIndex + 1}</span>{question}</p>
                ))}
              </div>
              {reviewMode ? (
                <div className="lesson-readonly-reflection">
                  <strong>Read-only review</strong>
                  {reflection.trim()
                    ? <p>{reflection}</p>
                    : <p className="muted">No reflection was saved for this lesson. Reflection was optional when you completed it.</p>}
                </div>
              ) : (
                <>
                  <textarea
                    className="field reflection-input"
                    value={reflection}
                    onChange={(event) => setReflection(event.target.value)}
                    maxLength={500}
                    placeholder="Write a few words, or leave this blank and skip..."
                    aria-label="Your reflection"
                  />
                  <small className="muted">{reflection.length}/500 characters</small>
                  <div className="reflection-actions">
                    <button className="btn btn-secondary" type="button" onClick={() => finish(false)}>Skip reflection</button>
                    <button className="btn" type="button" onClick={() => finish(true)} disabled={!reflection.trim()}>
                      Save reflection <CheckCircle2 size={17} />
                    </button>
                  </div>
                </>
              )}
              <small className="muted lesson-step-count">Step 4 of 4 · Reflection is optional</small>
            </>
          )}
        </div>
        {(reviewMode || step !== 'reflect') && (
          <div className="lesson-footer">
            {reviewMode ? (
              <>
                <button className="btn btn-secondary" type="button" disabled={index === 0} onClick={() => setStep(steps[index - 1])}>Previous</button>
                <span className="muted">Review step {index + 1} of 4</span>
                {index < steps.length - 1
                  ? <button className="btn" type="button" onClick={() => setStep(steps[index + 1])}>Next <ArrowRight size={17} /></button>
                  : <Link className="btn" to={journey ? `/journey/${journey.id}` : '/growth'}>Back to journey</Link>}
              </>
            ) : (
              <>
                <span className="muted">Step {index + 1} of 4</span>
                {step !== 'practise' && <button className="btn" type="button" onClick={continueLesson}>Continue <ArrowRight size={17} /></button>}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

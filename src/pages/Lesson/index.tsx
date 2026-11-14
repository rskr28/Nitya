import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Eye, Lightbulb, PencilLine, Target } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { findLesson } from '../../data/content';
import { finishWithoutReflection, recordLessonOpened, recordPractice, saveReflection, setLessonStep } from '../../features/growth/storage';
import type { LessonProgress } from '../../features/growth/storage';
import { notify } from '../../utils/toast';
import './index.css';

type Step = Exclude<LessonProgress['currentStep'], 'complete'>;
const steps: Step[] = ['discover', 'understand', 'practise', 'reflect'];
const labels = ['Discover', 'Understand', 'Practise', 'Reflect'];

export default function Lesson() {
  const { lessonId } = useParams();
  const lesson = findLesson(lessonId);
  const [step, setStep] = useState<LessonProgress['currentStep']>('discover');
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    if (!lesson) return;
    try {
      const state = recordLessonOpened(lesson);
      const saved = state.lessonProgress[lesson.id];
      setStep(saved.completed ? 'complete' : saved.currentStep);
      setReflection(state.reflections.find((item) => item.lessonId === lesson.id)?.text ?? '');
    } catch {
      notify('Progress could not be saved in this browser. Check your storage settings.', 'error');
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="page">
        <section className="lesson-shell surface lesson-not-found">
          <span className="eyebrow">Wisdom library</span>
          <h1>We couldn't find that lesson.</h1>
          <p>The link may be outdated, or this lesson hasn't been added to the prototype yet.</p>
          <Link className="btn" to="/explore">Browse available lessons <ArrowRight size={17} /></Link>
        </section>
      </div>
    );
  }

  const index = step === 'complete' ? 4 : steps.indexOf(step);
  const changeStep = (nextStep: Step) => {
    const state = setLessonStep(lesson.id, nextStep);
    const saved = state.lessonProgress[lesson.id];
    if (saved) setStep(saved.currentStep);
  };
  const continueLesson = () => {
    const nextStep = steps[Math.min(index + 1, steps.length - 1)];
    changeStep(nextStep);
  };
  const markPractised = () => {
    try {
      const state = recordPractice(lesson, 'Notice what is within your control');
      if (state.lessonProgress[lesson.id]?.currentStep !== 'reflect') {
        throw new Error('Practice stage was not saved');
      }
      setStep('reflect');
      notify('Practice attempt added to your Practice Log.');
    } catch {
      notify('We could not save your practice on this device. Please try again.', 'error');
    }
  };
  const finish = (withReflection: boolean) => {
    try {
      const state = withReflection
        ? saveReflection(lesson.id, lesson.title, reflection)
        : finishWithoutReflection(lesson.id);
      if (!state.lessonProgress[lesson.id]?.completed) {
        throw new Error('Lesson completion was not saved');
      }
      setStep('complete');
      notify(withReflection ? 'Reflection saved. Your lesson is complete.' : 'Lesson completed without a reflection.');
    } catch {
      notify('We could not save your completion on this device. Please try again.', 'error');
    }
  };

  if (step === 'complete') {
    return (
      <div className="page lesson-page">
        <Link to="/" className="back-link"><ArrowLeft size={17} /> Back to Home</Link>
        <section className="lesson-shell surface lesson-completion">
          <span className="completion-mark"><CheckCircle2 size={34} /></span>
          <span className="eyebrow">A moment well spent</span>
          <h1>You've completed this lesson.</h1>
          <p>You explored the teaching, tried the practice and completed the journey in your own way.</p>
          <div className="completion-summary">
            <strong>{lesson.title}</strong>
            <span>{lesson.source}</span>
            <span>{reflection.trim() ? 'Reflection saved on this device' : 'Completed without a reflection'}</span>
          </div>
          <div className="reflection-actions">
            <Link className="btn" to="/growth">View My Growth <ArrowRight size={17} /></Link>
            <Link className="btn btn-secondary" to="/">Return Home</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page lesson-page">
      <Link to="/explore" className="back-link"><ArrowLeft size={17} /> Back to Explore</Link>
      <section className="lesson-shell surface">
        <div className="lesson-top">
          <span className="eyebrow">{lesson.source}</span>
          <span className="lesson-time">A thoughtful ~{lesson.minutes} minute experience</span>
        </div>
        <div className="lesson-steps" aria-label="Lesson progress">
          {steps.map((currentStep, stepIndex) => (
            <button
              key={currentStep}
              type="button"
              disabled={stepIndex > index}
              onClick={() => changeStep(currentStep)}
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
              <p className="lesson-source">{lesson.source}</p>
              <div className="lesson-illustration" />
              <p>Some things are within our influence, while others are not. This teaching invites us to notice where our attention rests when we act.</p>
              <p>Begin by exploring the idea in its original context before bringing it into an ordinary moment of your day.</p>
            </>
          )}
          {step === 'understand' && (
            <>
              <span className="tag"><BookOpen size={14} /> Understand</span>
              <h1>Understanding the teaching</h1>
              <p>The Bhagavad Gita encourages attention to the quality and intention of our actions, without making our peace depend entirely on the outcome.</p>
              <blockquote>Focus on the action you can take. Notice when your mind becomes fixed on a result you cannot fully control.</blockquote>
              <h3>In simple terms</h3>
              <p>Give your effort honestly, while recognising that outcomes are shaped by many things beyond you.</p>
            </>
          )}
          {step === 'practise' && (
            <>
              <span className="tag"><Target size={14} /> Practise</span>
              <h1>Today's practice</h1>
              <div className="practice-block">
                <h3><CheckCircle2 /> What to do</h3>
                <p>Choose one meaningful task today. Before beginning, write down the part of the task that is within your control. Give that part your attention.</p>
              </div>
              <div className="practice-block">
                <h3><Eye /> What to observe</h3>
                <p>Notice when your thoughts move towards the result. Observe whether that changes how you feel or act.</p>
              </div>
              <div className="practice-block">
                <h3><Lightbulb /> What to learn</h3>
                <p>Notice the difference between focusing on your action and becoming attached to an outcome.</p>
              </div>
              <button className="btn" type="button" onClick={markPractised}>Mark as practised <ArrowRight size={17} /></button>
            </>
          )}
          {step === 'reflect' && (
            <>
              <span className="tag"><PencilLine size={14} /> Reflect · Optional</span>
              <h1>Your reflection</h1>
              <p>This space is private and stays on this device in this prototype. A few words are enough; you can also skip this step.</p>
              <textarea
                className="field reflection-input"
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                maxLength={500}
                placeholder="What did you notice during the practice?"
                aria-label="Your reflection"
              />
              <small className="muted">{reflection.length}/500 characters</small>
              <div className="reflection-actions">
                <button className="btn btn-secondary" type="button" onClick={() => finish(false)}>Skip reflection</button>
                <button className="btn" type="button" onClick={() => finish(true)} disabled={!reflection.trim()}>
                  Save reflection <CheckCircle2 size={17} />
                </button>
              </div>
              <small className="muted lesson-step-count">Step 4 of 4</small>
            </>
          )}
        </div>
        {step !== 'reflect' && (
          <div className="lesson-footer">
            <span className="muted">Step {index + 1} of 4</span>
            {step !== 'practise' && <button className="btn" type="button" onClick={continueLesson}>Continue <ArrowRight size={17} /></button>}
          </div>
        )}
      </section>
    </div>
  );
}

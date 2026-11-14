import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WisdomCard from '../../components/WisdomCard';
import LotusProgress from '../../components/LotusProgress';
import { featuredLesson, journeys } from '../../data/content';
import { useTimeOfDay } from '../../hooks/useTimeOfDay';
import { useGrowth } from '../../hooks/useGrowth';
import { getLotusStage } from '../../utils/lotus';
import './index.css';

export default function Home() {
  const { growth, counts } = useGrowth();
  const time = useTimeOfDay();
  const progress = growth.lessonProgress[featuredLesson.id];
  const actionLabel = !progress ? 'Begin learning' : progress.completed ? 'Review lesson' : 'Continue learning';
  const continueLabel = !progress
    ? 'Begin your first learning experience'
    : progress.completed ? 'Revisit your completed lesson' : 'Continue where you left off';
  const continueDetail = !progress
    ? 'A short in-app introduction'
    : progress.completed ? 'Read again without changing progress' : `Your lesson · ${progress.currentStep}`;
  const featuredJourney = journeys[0];
  const completedJourney = growth.journeysCompleted.includes(featuredJourney.id);

  return (
    <div className="page home-page">
      <section
        className={`home-hero home-hero--${time.period}`}
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(20,43,34,.72) 0%, rgba(20,43,34,.47) 48%, rgba(20,43,34,.12) 100%), url("${time.backgroundImage}")`,
        }}
      >
        <div className="home-hero__copy">
          <span className="eyebrow">A moment for yourself</span>
          <h1>{time.greeting}</h1>
          <p>{time.supportingText}</p>
        </div>
      </section>
      <div className="home-grid">
        <div className="home-main">
          <WisdomCard lesson={featuredLesson} actionLabel={actionLabel} reviewMode={Boolean(progress?.completed)} />
          <Link to={`/journey/${featuredJourney.id}`} className="home-journey-card surface">
            <span className="eyebrow">Your guided learning path · 3 lessons</span>
            <strong>{featuredJourney.title}</strong>
            <span>{featuredJourney.description}</span>
            <b>{completedJourney ? 'Journey completed · Revisit' : 'Explore the journey'} <ArrowRight size={15} /></b>
          </Link>
          <Link to={`/lesson/${featuredLesson.id}${progress?.completed ? '?review=1' : ''}`} className="continue-card surface">
            <span className="continue-card__icon"><PlayCircle /></span>
            <span><strong>{continueLabel}</strong><small>{continueDetail}</small></span>
            <ArrowRight size={18} />
          </Link>
        </div>
        <aside className="home-lotus">
          <LotusProgress stage={getLotusStage(counts)} />
          <div className="quote-card surface">
            <span>“</span>
            <p>Give your attention to the work. Let its outcome become information, not your identity.</p>
            <small>NITYA reflection · Inspired by Bhagavad Gītā 2.47 · Paraphrase</small>
          </div>
        </aside>
      </div>
    </div>
  );
}

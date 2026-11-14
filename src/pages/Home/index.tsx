import { ArrowRight, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WisdomCard from '../../components/WisdomCard';
import LotusProgress from '../../components/LotusProgress';
import { featuredLesson } from '../../data/content';
import { useGrowth } from '../../hooks/useGrowth';
import { getLotusStage } from '../../utils/lotus';
import './index.css';

export default function Home() {
  const { growth, counts } = useGrowth();
  const progress = growth.lessonProgress[featuredLesson.id];
  const actionLabel = !progress ? 'Begin learning' : progress.completed ? 'View completion' : 'Continue learning';
  const continueLabel = !progress
    ? 'Begin your first learning experience'
    : progress.completed ? 'You completed this lesson' : 'Continue where you left off';
  const continueDetail = !progress
    ? 'A thoughtful five-minute start'
    : progress.completed ? 'Revisit your completed lesson' : `Your lesson · ${progress.currentStep}`;

  return (
    <div className="page home-page">
      <section className="home-hero">
        <div>
          <span className="eyebrow">A moment for yourself</span>
          <h1>Good morning.</h1>
          <p>Here's something meaningful for you today.</p>
        </div>
      </section>
      <div className="home-grid">
        <div className="home-main">
          <WisdomCard lesson={featuredLesson} actionLabel={actionLabel} />
          <Link to={`/lesson/${featuredLesson.id}`} className="continue-card surface">
            <span className="continue-card__icon"><PlayCircle /></span>
            <span><strong>{continueLabel}</strong><small>{continueDetail}</small></span>
            <ArrowRight size={18} />
          </Link>
        </div>
        <aside className="home-lotus">
          <LotusProgress stage={getLotusStage(counts)} />
          <div className="quote-card surface">
            <span>“</span>
            <p>You have the right to action, not to the fruits of action.</p>
            <small>Bhagavad Gita · 2.47</small>
          </div>
        </aside>
      </div>
    </div>
  );
}

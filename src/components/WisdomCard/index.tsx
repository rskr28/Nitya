import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LessonSummary } from '../../types';
import { assets } from '../../config/assets';
import './index.css';

export default function WisdomCard({ lesson, actionLabel = 'Begin learning', reviewMode = false }: { lesson: LessonSummary; actionLabel?: string; reviewMode?: boolean }) {
  return (
    <article className="wisdom-card surface">
      <div className="wisdom-card__body">
        <span className="tag"><BookOpen size={14} /> Today's Wisdom</span>
        <h2>{lesson.title}</h2>
        <p className="wisdom-card__source">{lesson.source}</p>
        <p>{lesson.description}</p>
        <div className="wisdom-card__footer">
          <span><Clock3 size={16} /> ~ {lesson.inAppMinutes} min in-app</span>
          <Link className="btn" to={`/lesson/${lesson.id}${reviewMode ? '?review=1' : ''}`}>{actionLabel} <ArrowRight size={17} /></Link>
        </div>
      </div>
      <div className="wisdom-card__art">
        <img src={assets.wisdom.lotus} alt="A pink lotus in bloom resting on still water" loading="lazy" decoding="async" />
      </div>
    </article>
  );
}

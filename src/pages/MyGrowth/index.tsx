import { BookOpen, CheckCircle2, Footprints, Sprout } from 'lucide-react';
import { useState } from 'react';
import LotusProgress from '../../components/LotusProgress';
import { lessons } from '../../data/content';
import { useGrowth } from '../../hooks/useGrowth';
import type { GrowthTab } from '../../types';
import { getLotusStage } from '../../utils/lotus';
import './index.css';

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, {
  day: 'numeric', month: 'short', year: 'numeric',
});

export default function MyGrowth() {
  const [tab, setTab] = useState<GrowthTab>('journey');
  const { growth, counts } = useGrowth();
  const stage = getLotusStage(counts);
  const exploredLessons = lessons.filter((lesson) => growth.lessonsExplored.includes(lesson.id));
  const completedLessons = exploredLessons.filter((lesson) => growth.lessonProgress[lesson.id]?.completed);
  const inProgressLessons = exploredLessons.filter((lesson) => !growth.lessonProgress[lesson.id]?.completed);

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">Your personal journey</span>
        <h1>My Growth</h1>
        <p>A quiet space to recognise what you've learned and practised.</p>
      </div>
      <div className="growth-tabs" role="tablist" aria-label="Growth sections">
        {([
          { id: 'journey', label: 'Journey' },
          { id: 'learnings', label: 'Learnings' },
          { id: 'practice-log', label: 'Practice Log' },
        ] as { id: GrowthTab; label: string }[]).map((item) => (
          <button
            key={item.id}
            role="tab"
            id={`growth-tab-${item.id}`}
            aria-controls="growth-tab-panel"
            aria-selected={tab === item.id}
            className={tab === item.id ? 'is-active' : ''}
            onClick={() => setTab(item.id)}
            type="button"
          >{item.label}</button>
        ))}
      </div>

      <div id="growth-tab-panel" role="tabpanel" aria-labelledby={`growth-tab-${tab}`}>
        {tab === 'journey' && (
          <>
            <div className="growth-summary">
              <LotusProgress stage={stage} />
              <div className="counts-card surface">
                <h3>Your journey at a glance</h3>
                <div className="counts-grid">
                  <div><BookOpen /><strong>{counts.lessonsExplored}</strong><small>Lessons explored</small></div>
                  <div><Footprints /><strong>{counts.practicesAttempted}</strong><small>Practices attempted</small></div>
                  <div><Sprout /><strong>{counts.journeysCompleted}</strong><small>Journeys completed</small></div>
                </div>
              </div>
            </div>
            <div className="section-title"><h2>Your journey</h2></div>
            <div className="timeline surface">
              {growth.lessonsExplored.length === 0 && growth.practices.length === 0 && (
                <div className="empty-state">Your learning and practice history will appear here as you explore.</div>
              )}
              {exploredLessons.map((lesson) => {
                const progress = growth.lessonProgress[lesson.id];
                return (
                  <div className="timeline-item" key={lesson.id}>
                    <CheckCircle2 />
                    <div>
                      <strong>{progress?.completed ? `Completed: ${lesson.title}` : `Started: ${lesson.title}`}</strong>
                      <p>{progress?.completed ? 'You completed this lesson.' : 'You began exploring this teaching.'}</p>
                    </div>
                  </div>
                );
              })}
              {growth.journeysCompleted.map((journeyId) => (
                <div className="timeline-item" key={journeyId}>
                  <Sprout />
                  <div><strong>Learning journey completed</strong><p>{journeyId}</p></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'learnings' && (
          <div className="list-panel surface">
            <h3>Your learnings</h3>
            {exploredLessons.length === 0 && <div className="empty-state">Lessons you begin will be collected here.</div>}
            {inProgressLessons.map((lesson) => (
              <div className="record-row" key={lesson.id}>
                <BookOpen />
                <div><strong>{lesson.title}</strong><small>{lesson.source}</small></div>
                <span className="record-status">In progress</span>
              </div>
            ))}
            {completedLessons.map((lesson) => (
              <div className="record-row" key={lesson.id}>
                <CheckCircle2 />
                <div><strong>{lesson.title}</strong><small>{lesson.source}</small></div>
                <span className="record-status">Completed</span>
              </div>
            ))}
            {growth.reflections.length > 0 && (
              <>
                <div className="section-title"><h3>Saved reflections</h3></div>
                {growth.reflections.map((reflection) => (
                  <article className="reflection-record" key={reflection.lessonId}>
                    <strong>{reflection.lessonTitle}</strong>
                    <p>{reflection.text}</p>
                    <small>{formatDate(reflection.savedAt)}</small>
                  </article>
                ))}
              </>
            )}
          </div>
        )}

        {tab === 'practice-log' && (
          <div className="list-panel surface">
            <h3>Practice log</h3>
            {growth.practices.length === 0 && <div className="empty-state">Practice attempts you record will appear here. You are never asked to prove a practice.</div>}
            {growth.practices.map((practice) => (
              <div className="record-row" key={practice.id}>
                <Footprints />
                <div><strong>{practice.activity}</strong><small>Associated lesson: {practice.lessonTitle}</small></div>
                <span className="record-date">{formatDate(practice.attemptedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

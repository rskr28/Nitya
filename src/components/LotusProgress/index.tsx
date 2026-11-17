import { useEffect, useState } from 'react';
import type { LotusStage } from '../../types';
import { lotusStageLabels } from '../../utils/lotus';
import { assets } from '../../config/assets';
import { consumePendingLotusTransition, type LotusTransition } from '../../features/growth/storage';
import './index.css';

const stages: LotusStage[] = ['seed', 'sprout', 'early-bloom', 'full-bloom', 'radiant-bloom'];

export default function LotusProgress({ stage }: { stage: LotusStage }) {
  const [transition, setTransition] = useState<LotusTransition | null>(null);
  const index = stages.indexOf(stage);

  useEffect(() => {
    const pending = consumePendingLotusTransition(stage);
    if (!pending) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!reducedMotion) setTransition(pending);
  }, [stage]);

  return (
    <section
      className={`lotus-progress surface ${transition ? 'lotus-progress--celebrating' : ''}`}
      aria-label={`Your growing lotus: ${lotusStageLabels[stage]}`}
      aria-live="polite"
    >
      <div className="lotus-progress__image" aria-hidden="true">
        {transition && (
          <img
            key={transition.from}
            className="lotus-progress__photo lotus-progress__photo--from"
            src={assets.lotus[transition.from]}
            alt=""
          />
        )}
        <img
          key={transition ? `to-${transition.to}` : stage}
          className={`lotus-progress__photo ${transition ? 'lotus-progress__photo--to' : 'lotus-progress__photo--idle'}`}
          src={assets.lotus[stage]}
          alt=""
          onAnimationEnd={transition ? () => setTransition(null) : undefined}
        />
        <span className="lotus-progress__water" />
        {transition && <span className="lotus-progress__glow" />}
      </div>
      <div className="lotus-progress__details">
        <span className="eyebrow">Your growing lotus</span>
        <h3>{lotusStageLabels[stage]}</h3>
        <p>{stage === 'seed' ? 'Starting the journey' : 'Your learning journey continues'}</p>
        <div className="stage-track" aria-label={`Stage ${index + 1} of 5`}>
          {stages.map((item, itemIndex) => (
            <span key={item} className={itemIndex <= index ? 'is-filled' : ''} />
          ))}
        </div>
        <small>Stage {index + 1} of 5</small>
      </div>
    </section>
  );
}

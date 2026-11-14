import type { LotusStage } from '../../types';
import { lotusStageLabels } from '../../utils/lotus';
import './index.css';
const stages: LotusStage[] = ['seed','sprout','early-bloom','full-bloom','radiant-bloom'];
export default function LotusProgress({stage,celebrate=false}:{stage:LotusStage;celebrate?:boolean}) {
  const index=stages.indexOf(stage);
  return <section className={`lotus-progress surface ${celebrate?'lotus-progress--celebrating':''}`} aria-label={`Your growing lotus: ${lotusStageLabels[stage]}`}>
    <div className="lotus-progress__image" aria-hidden="true"><img src={`/images/lotus/${stage}.webp`} alt="" /></div>
    <div className="lotus-progress__details"><span className="eyebrow">Your growing lotus</span><h3>{lotusStageLabels[stage]}</h3><p>{stage==='seed'?'Starting the journey':'Your learning journey continues'}</p>
      <div className="stage-track" aria-label={`Stage ${index+1} of 5`}>{stages.map((s,i)=><span key={s} className={i<=index?'is-filled':''}/>)}</div><small>Stage {index+1} of 5</small>
    </div>
  </section>;
}
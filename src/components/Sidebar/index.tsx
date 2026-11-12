import { Compass, House, Sprout } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './index.css';
const links=[{to:'/',label:'Home',Icon:House},{to:'/explore',label:'Explore',Icon:Compass},{to:'/growth',label:'My Growth',Icon:Sprout}];
export default function Sidebar(){return <aside className="sidebar"><NavLink to="/" className="sidebar__brand"><span className="brand-mark">✿</span><span>NITYA</span></NavLink><nav className="sidebar__nav">{links.map(({to,label,Icon})=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`sidebar__link ${isActive?'is-active':''}`}><Icon size={19}/><span>{label}</span></NavLink>)}</nav><div className="sidebar__bottom"><span>Ancient Wisdom.</span><strong>Modern Living.</strong></div></aside>}

import { Compass, House, Sprout } from 'lucide-react';import { NavLink } from 'react-router-dom';import './index.css';
const links=[{to:'/',label:'Home',Icon:House},{to:'/explore',label:'Explore',Icon:Compass},{to:'/growth',label:'My Growth',Icon:Sprout}];
export default function BottomNavigation(){return <nav className="mobile-nav">{links.map(({to,label,Icon})=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`mobile-nav__link ${isActive?'is-active':''}`}><Icon size={21}/><span>{label}</span></NavLink>)}</nav>}

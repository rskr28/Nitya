import { Bell, ChevronDown, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import './index.css';
export default function Header(){return <header className="topbar"><Link to="/" className="topbar__mobile-brand">✿ NITYA</Link><div className="topbar__desktop-title">Ancient Wisdom. <span>Modern Living.</span></div><div className="topbar__actions"><button className="icon-button" aria-label="Notifications"><Bell size={19}/></button><Link to="/account" className="avatar" aria-label="Open account"><UserRound size={18}/></Link></div></header>}

import { Bell, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assets } from '../../config/assets';
import './index.css';

export default function Header() {
  return (
    <header className="topbar">
      <Link to="/" className="topbar__brand" aria-label="NITYA home">
        <span className="topbar__desktop-title">Ancient Wisdom. Modern Living.</span>
        <img className="topbar__mobile-emblem" src={assets.brand.symbol} alt="" />
      </Link>
      <div className="topbar__actions">
        <button
          className="icon-button"
          type="button"
          aria-label="Notifications unavailable in this prototype"
          disabled
          title="Notifications are not available yet"
        >
          <Bell size={19} />
        </button>
        <Link to="/account" className="avatar" aria-label="Open account">
          <UserRound size={18} />
        </Link>
      </div>
    </header>
  );
}

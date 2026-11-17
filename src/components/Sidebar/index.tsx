import { Compass, House, Sprout } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../config/assets';
import './index.css';

const links = [
  { to: '/', label: 'Home', Icon: House },
  { to: '/explore', label: 'Explore', Icon: Compass },
  { to: '/growth', label: 'My Growth', Icon: Sprout },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar__brand" aria-label="NITYA home">
        <img
          className="sidebar__brand-lockup"
          src={assets.brand.logo}
          alt="NITYA — One good act, every day."
        />
        <img
          className="sidebar__brand-symbol"
          src={assets.brand.symbol}
          alt=""
          aria-hidden="true"
        />
      </NavLink>
      <nav className="sidebar__nav" aria-label="Main navigation">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            aria-label={label}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

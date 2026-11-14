import { Bell, Info, LogOut, SlidersHorizontal, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { notify } from '../../utils/toast';
import './index.css';

const items = [
  { id: 'personal', label: 'Personal information', Icon: UserRound },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'privacy', label: 'Privacy', Icon: ShieldCheck },
  { id: 'preferences', label: 'Preferences', Icon: SlidersHorizontal },
  { id: 'about', label: 'About NITYA', Icon: Info },
];
interface LocalProfile { name: string; email: string; }
function readProfile(): LocalProfile {
  try {
    const raw = window.localStorage.getItem('nitya.profile.v1');
    if (!raw) return { name: '', email: '' };
    const parsed = JSON.parse(raw) as Partial<LocalProfile>;
    return { name: parsed.name ?? '', email: parsed.email ?? '' };
  } catch {
    return { name: '', email: '' };
  }
}

export default function Account() {
  const [active, setActive] = useState('personal');
  const [profile, setProfile] = useState<LocalProfile>(readProfile);
  const current = items.find((item) => item.id === active) ?? items[0];

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      window.localStorage.setItem('nitya.profile.v1', JSON.stringify(profile));
      notify('Your profile details were saved on this device.');
    } catch {
      notify('We could not save your profile on this device.', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">Your space</span>
        <h1>Account</h1>
        <p>Manage your information and understand how this prototype stores data.</p>
      </div>
      <div className="account-layout">
        <nav className="account-menu surface" aria-label="Account sections">
          {items.map(({ id, label, Icon }) => (
            <button key={id} type="button" className={active === id ? 'is-active' : ''} onClick={() => setActive(id)}>
              <Icon size={18} />{label}
            </button>
          ))}
          <button className="logout-button" type="button" disabled title="Sign out is unavailable until authentication is implemented">
            <LogOut size={18} />Log out <small>Unavailable</small>
          </button>
        </nav>
        <section className="account-content surface" aria-labelledby="account-section-title">
          <div className="account-content__heading">
            <span className="account-avatar"><UserRound size={28} /></span>
            <div><h2 id="account-section-title">{current.label}</h2><p>{`Manage your ${current.label.toLowerCase()}.`}</p></div>
          </div>

          {active === 'personal' && (
            <form className="account-form" onSubmit={saveProfile}>
              <p className="account-note">These details are saved only in this browser. They are not connected to an online account.</p>
              <label>Display name
                <input className="field" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} maxLength={80} placeholder="Enter your name" />
              </label>
              <label>Email address
                <input className="field" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} maxLength={254} placeholder="name@example.com" />
              </label>
              <button className="btn" type="submit">Save details</button>
            </form>
          )}

          {active === 'notifications' && (
            <div className="account-information">
              <span className="account-status">Not available in this prototype</span>
              <p>Learning reminders and announcements are not sent yet. We have left notification controls out rather than showing switches that would not do anything.</p>
            </div>
          )}
          {active === 'privacy' && (
            <div className="account-information">
              <span className="account-status">Local prototype storage</span>
              <p>Your learning progress, practice attempts, reflections and display details are saved in this browser's local storage. They are not synced to a server or shared with other users.</p>
              <p>Clearing this browser's site data will remove these local records. Backend accounts and data controls will be designed before cloud sync is introduced.</p>
            </div>
          )}
          {active === 'preferences' && (
            <div className="account-information">
              <span className="account-status">Not available in this prototype</span>
              <p>Personalisation preferences are not active yet. The current visual experience follows the approved NITYA design system and your device's reduced-motion setting.</p>
            </div>
          )}
          {active === 'about' && (
            <div className="account-information">
              <span className="account-status">NITYA · Frontend prototype</span>
              <h3>Ancient Wisdom. Modern Living.</h3>
              <p>NITYA is a space to discover meaningful ideas, understand their context, practise them in everyday life and reflect at your own pace.</p>
              <p>This version stores prototype progress locally. It is not a production account or backend-connected application.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

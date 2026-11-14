import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MyGrowth from './pages/MyGrowth';
import Account from './pages/Account';
import Lesson from './pages/Lesson';
import Journey from './pages/Journey';

export default function App() {
  return <Routes><Route element={<AppLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/growth" element={<MyGrowth />} />
    <Route path="/account" element={<Account />} />
    <Route path="/lesson/:lessonId" element={<Lesson />} />
    <Route path="/journey/:journeyId" element={<Journey />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes>;
}

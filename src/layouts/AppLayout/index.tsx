import { Outlet } from 'react-router-dom';import Sidebar from '../../components/Sidebar';import Header from '../../components/Header';import BottomNavigation from '../../components/BottomNavigation';import './index.css';
export default function AppLayout(){return <><Sidebar/><main className="app-main"><Header/><Outlet/></main><BottomNavigation/></>}

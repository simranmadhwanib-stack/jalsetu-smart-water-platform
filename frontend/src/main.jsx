import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './styles/index.css';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Schedule from './pages/Schedule.jsx';
import TankerTracking from './pages/TankerTracking.jsx';
import Complaints from './pages/Complaints.jsx';
import Analytics from './pages/Analytics.jsx';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';

function RequireAuth({ children, role }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/citizen'} replace />;
  return children;
}

const router = createBrowserRouter([{ path: '/', element: <Layout />, children: [
  { index: true, element: <Landing /> },
  { path: 'login', element: <Auth /> },
  { path: 'citizen', element: <RequireAuth role="citizen"><Dashboard /></RequireAuth> },
  { path: 'admin', element: <RequireAuth role="admin"><Dashboard admin /></RequireAuth> },
  { path: 'schedule', element: <RequireAuth><Schedule /></RequireAuth> },
  { path: 'tankers', element: <RequireAuth><TankerTracking /></RequireAuth> },
  { path: 'complaints', element: <RequireAuth><Complaints /></RequireAuth> },
  { path: 'analytics', element: <RequireAuth><Analytics /></RequireAuth> },
  { path: 'notifications', element: <RequireAuth><Notifications /></RequireAuth> },
  { path: 'profile', element: <RequireAuth><Profile /></RequireAuth> }
]}]);

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><AppProvider><RouterProvider router={router} /></AppProvider></React.StrictMode>);

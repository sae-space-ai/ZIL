import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { User } from '../lib/auth';
import { useState } from 'react';

interface LayoutProps {
  user: User;
}

export default function Layout({ user }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        user={user}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <Header user={user} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

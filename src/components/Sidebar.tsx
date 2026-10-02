import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Megaphone,
  Users,
  FileText,
  PenTool,
  Calculator,
  Package,
  Paperclip,
  ShieldCheck,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { User } from '../lib/auth';

interface SidebarProps {
  user: User;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/calls', label: 'Calls', icon: Megaphone },
  { path: '/consortium', label: 'Consortium', icon: Users },
  { path: '/part-a', label: 'Part A', icon: FileText },
  { path: '/part-b', label: 'Part B', icon: PenTool },
  { path: '/budget', label: 'Budget', icon: Calculator },
  { path: '/work-packages', label: 'Work Packages', icon: Package },
  { path: '/annexes', label: 'Annexes', icon: Paperclip },
  { path: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { path: '/submission', label: 'Submission', icon: Send },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ user, collapsed, onToggle, onLogout }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-sidebar text-white transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex-shrink-0 w-8 h-8 bg-eu-gold rounded-lg flex items-center justify-center">
          <GraduationCap size={18} className="text-eu-blue" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white whitespace-nowrap">EU Grant</h1>
            <p className="text-[10px] text-slate-400 whitespace-nowrap">Submission Engine</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-sidebar-active text-white shadow-lg shadow-blue-900/20'
                      : 'text-slate-400 hover:bg-sidebar-hover hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-eu-gold' : ''}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-white/20 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-sidebar-hover transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}

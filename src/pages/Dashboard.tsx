import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Megaphone,
  FileText,
  Calculator,
  ShieldCheck,
  Send,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Users,
} from 'lucide-react';
import { getProjects, Project } from '../lib/store';
import { User } from '../lib/auth';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const projects = getProjects();
  const activeProjects = projects.filter(p => p.status !== 'archived');
  const draftProjects = projects.filter(p => p.status === 'draft');
  const inProgressProjects = projects.filter(p => p.status === 'in_progress');
  const reviewProjects = projects.filter(p => p.status === 'review');

  const totalBudget = projects.reduce((sum, p) => sum + p.estimatedBudget, 0);

  const stats = [
    { label: 'Active Projects', value: activeProjects.length, icon: FolderKanban, color: 'bg-primary-500', change: '+2 this month' },
    { label: 'Total Budget', value: `€${(totalBudget / 1000000).toFixed(1)}M`, icon: Calculator, color: 'bg-emerald-500', change: '+15% vs last quarter' },
    { label: 'Pending Review', value: reviewProjects.length, icon: ShieldCheck, color: 'bg-amber-500', change: '2 need attention' },
    { label: 'Submissions Ready', value: '1', icon: Send, color: 'bg-violet-500', change: 'QUANTUM-CLIM ready' },
  ];

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-amber-100 text-amber-700';
      case 'submitted': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-gray-100 text-gray-500';
    }
  };

  const getProgressForProject = (project: Project) => {
    switch (project.status) {
      case 'draft': return 15;
      case 'in_progress': return 55;
      case 'review': return 85;
      case 'submitted': return 100;
      case 'archived': return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">Here's an overview of your EU grant activities</p>
        </div>
        <Link
          to="/projects"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          New Project
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <TrendingUp size={14} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-2">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-500" />
              Recent Projects
            </h2>
            <Link to="/projects" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {activeProjects.slice(0, 4).map((project) => (
              <Link
                key={project.id}
                to="/projects"
                className="px-5 py-4 hover:bg-slate-50 transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-800 text-sm">{project.acronym}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{project.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {project.duration} months
                      </span>
                      <span className="text-xs text-slate-400">
                        €{(project.estimatedBudget / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users size={12} /> {project.coordinator}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 w-24">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-600 font-medium">{getProgressForProject(project)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${getProgressForProject(project)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'New Project', icon: FolderKanban, path: '/projects', color: 'text-primary-600 bg-primary-50' },
                { label: 'Analyze Call', icon: Megaphone, path: '/calls', color: 'text-violet-600 bg-violet-50' },
                { label: 'Edit Part A', icon: FileText, path: '/part-a', color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Budget Engine', icon: Calculator, path: '/budget', color: 'text-amber-600 bg-amber-50' },
                { label: 'Run Compliance', icon: ShieldCheck, path: '/compliance', color: 'text-red-600 bg-red-50' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.path}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{action.label}</span>
                    <ArrowUpRight size={12} className="ml-auto text-slate-300 group-hover:text-slate-500" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Submission Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-sm text-slate-600">Completed</span>
                </div>
                <span className="text-sm font-medium text-slate-800">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-sm text-slate-600">In Progress</span>
                </div>
                <span className="text-sm font-medium text-slate-800">{inProgressProjects.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span className="text-sm text-slate-600">Drafts</span>
                </div>
                <span className="text-sm font-medium text-slate-800">{draftProjects.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { time: '2 hours ago', action: 'Budget updated for QUANTUM-CLIM', type: 'budget' },
            { time: '5 hours ago', action: 'New participant added to AI-MOBILITY consortium', type: 'consortium' },
            { time: '1 day ago', action: 'Compliance check passed for BIOELECTRON Part A', type: 'compliance' },
            { time: '2 days ago', action: 'Call HORIZON-CL5-2024 analysis completed', type: 'call' },
            { time: '3 days ago', action: 'Work package WP3 deliverable uploaded', type: 'workpackage' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-400 mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-slate-700">{activity.action}</p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

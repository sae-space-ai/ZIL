import { useState } from 'react';
import { getProjects, createProject, deleteProject, archiveProject, Project } from '../lib/store';
import { Plus, Search, Filter, MoreVertical, Archive, Trash2, Edit, Eye, X } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.acronym.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreate = (data: Partial<Project>) => {
    const project = createProject({
      title: data.title || '',
      acronym: data.acronym || '',
      summary: data.summary || '',
      objectives: data.objectives || [],
      duration: data.duration || 36,
      programme: data.programme || 'Horizon Europe',
      callId: data.callId || '',
      estimatedBudget: data.estimatedBudget || 0,
      coordinator: data.coordinator || '',
      status: 'draft',
      createdBy: 'current_user',
    });
    setProjects(getProjects());
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  };

  const handleArchive = (id: string) => {
    archiveProject(id);
    setProjects(getProjects());
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-slate-100 text-slate-700',
      in_progress: 'bg-blue-100 text-blue-700',
      review: 'bg-amber-100 text-amber-700',
      submitted: 'bg-green-100 text-green-700',
      archived: 'bg-gray-100 text-gray-500',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your EU grant proposals</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="submitted">Submitted</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
              <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-slate-100 rounded">
                  <MoreVertical size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 text-sm mb-1">{project.acronym}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{project.title}</p>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Programme</span>
                <span className="text-slate-700">{project.programme}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="text-slate-700">{project.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span>Budget</span>
                <span className="text-slate-700">€{(project.estimatedBudget / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex justify-between">
                <span>Coordinator</span>
                <span className="text-slate-700 truncate ml-2">{project.coordinator}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
              <button className="flex-1 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Eye size={12} /> View
              </button>
              <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                <Edit size={12} /> Edit
              </button>
              <button
                onClick={() => handleArchive(project.id)}
                className="py-1.5 px-2 text-xs text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Archive"
              >
                <Archive size={12} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="py-1.5 px-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No projects found</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
          >
            Create your first project
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}

function CreateProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (data: Partial<Project>) => void }) {
  const [form, setForm] = useState({
    title: '',
    acronym: '',
    summary: '',
    duration: 36,
    programme: 'Horizon Europe',
    callId: '',
    estimatedBudget: 0,
    coordinator: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Create New Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Full project title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acronym *</label>
              <input
                type="text"
                required
                value={form.acronym}
                onChange={(e) => setForm({ ...form, acronym: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="PROJECT-ACR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (months) *</label>
              <input
                type="number"
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              placeholder="Brief description of the project"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Programme</label>
              <select
                value={form.programme}
                onChange={(e) => setForm({ ...form, programme: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option>Horizon Europe</option>
                <option>ERC</option>
                <option>MSCA</option>
                <option>EIC</option>
                <option>Digital Europe</option>
                <option>LIFE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Call ID</label>
              <input
                type="text"
                value={form.callId}
                onChange={(e) => setForm({ ...form, callId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="HORIZON-CL4-2024-..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Budget (€)</label>
              <input
                type="number"
                value={form.estimatedBudget}
                onChange={(e) => setForm({ ...form, estimatedBudget: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Coordinator</label>
              <input
                type="text"
                value={form.coordinator}
                onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="Lead organization"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

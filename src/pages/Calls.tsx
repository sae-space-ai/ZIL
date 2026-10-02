import { useState } from 'react';
import { Upload, FileText, Search, Plus, ExternalLink, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface Call {
  id: string;
  identifier: string;
  title: string;
  programme: string;
  deadline: string;
  budget: string;
  status: 'open' | 'closing_soon' | 'closed';
  requirements: number;
  uploadedDocs: number;
}

const sampleCalls: Call[] = [
  {
    id: 'call_001',
    identifier: 'HORIZON-CL5-2024-CL3-01',
    title: 'Climate Sciences and Solutions for European Green Deal',
    programme: 'Horizon Europe - Cluster 5',
    deadline: '2025-03-15',
    budget: '€120M',
    status: 'open',
    requirements: 24,
    uploadedDocs: 3,
  },
  {
    id: 'call_002',
    identifier: 'HORIZON-CL4-2024-DIGITAL-01',
    title: 'AI for Smart Cities and Mobility',
    programme: 'Horizon Europe - Cluster 4',
    deadline: '2025-02-28',
    budget: '€85M',
    status: 'closing_soon',
    requirements: 18,
    uploadedDocs: 1,
  },
  {
    id: 'call_003',
    identifier: 'ERC-2024-SYG',
    title: 'ERC Synergy Grants',
    programme: 'European Research Council',
    deadline: '2025-01-30',
    budget: '€400M',
    status: 'open',
    requirements: 12,
    uploadedDocs: 0,
  },
  {
    id: 'call_004',
    identifier: 'HORIZON-HEALTH-2024',
    title: 'Personalised Health Interventions',
    programme: 'Horizon Europe - Health',
    deadline: '2024-12-01',
    budget: '€200M',
    status: 'closed',
    requirements: 22,
    uploadedDocs: 4,
  },
];

export default function Calls() {
  const [calls] = useState<Call[]>(sampleCalls);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const filteredCalls = calls.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.identifier.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Call['status']) => {
    switch (status) {
      case 'open': return { style: 'bg-green-100 text-green-700', icon: CheckCircle2, label: 'Open' };
      case 'closing_soon': return { style: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Closing Soon' };
      case 'closed': return { style: 'bg-slate-100 text-slate-500', icon: AlertTriangle, label: 'Closed' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Call Intelligence</h1>
          <p className="text-slate-500 mt-1">Analyze EU calls and extract structured requirements</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Call Document
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search calls by identifier or title..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {/* Calls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCalls.map((call) => {
          const badge = getStatusBadge(call.status);
          const StatusIcon = badge.icon;
          return (
            <div key={call.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${badge.style}`}>
                    <StatusIcon size={10} />
                    {badge.label}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{call.programme}</span>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{call.identifier}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{call.title}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Budget</p>
                  <p className="text-sm font-semibold text-slate-800">{call.budget}</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Deadline</p>
                  <p className="text-sm font-semibold text-slate-800">{call.deadline}</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Requirements</p>
                  <p className="text-sm font-semibold text-slate-800">{call.requirements}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FileText size={12} />
                  <span>{call.uploadedDocs} documents uploaded</span>
                </div>
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                  Analyze <ExternalLink size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload Call Documents</h2>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="text-sm text-slate-600 font-medium">Drop PDF, DOCX or XLSX files here</p>
                <p className="text-xs text-slate-400 mt-1">or click to browse</p>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Call Identifier</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="HORIZON-CL4-2024-..."
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Call URL (optional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="https://ec.europa.eu/..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Start Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-800 mb-2">Call Intelligence Engine</h3>
        <p className="text-sm text-blue-700 mb-3">
          Upload official call documentation and our AI engine will extract structured requirements including:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['Objectives', 'Eligibility', 'Evaluation Criteria', 'Budget Model', 'Consortium Requirements', 'Page Limits', 'Expected Outcomes', 'Annexes'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-blue-600">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

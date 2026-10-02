import { Paperclip, Upload, FileText, CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

interface Annex {
  id: string;
  name: string;
  description: string;
  type: 'mandatory' | 'conditional' | 'optional' | 'not_applicable';
  status: 'completed' | 'in_progress' | 'pending' | 'not_required';
  generatedBySystem: boolean;
  lastModified?: string;
}

const annexes: Annex[] = [
  { id: 'a1', name: 'Participant Profiles (PIC Data)', description: 'Legal and financial data for each beneficiary', type: 'mandatory', status: 'completed', generatedBySystem: true, lastModified: '2024-12-01' },
  { id: 'a2', name: 'CVs of Key Personnel', description: 'Curricula vitae for PI and co-PIs', type: 'mandatory', status: 'in_progress', generatedBySystem: false, lastModified: '2024-11-28' },
  { id: 'a3', name: 'Data Management Plan', description: 'DMP following FAIR principles', type: 'mandatory', status: 'in_progress', generatedBySystem: true, lastModified: '2024-11-25' },
  { id: 'a4', name: 'Gantt Chart', description: 'Visual timeline of work packages', type: 'mandatory', status: 'completed', generatedBySystem: true, lastModified: '2024-12-05' },
  { id: 'a5', name: 'Letters of Support', description: 'Endorsement from stakeholders', type: 'conditional', status: 'pending', generatedBySystem: false },
  { id: 'a6', name: 'Ethics Self-Assessment', description: 'Ethics issues table and justification', type: 'conditional', status: 'completed', generatedBySystem: true, lastModified: '2024-11-20' },
  { id: 'a7', name: 'Dissemination & Exploitation Plan', description: 'Strategy for results dissemination', type: 'conditional', status: 'in_progress', generatedBySystem: true, lastModified: '2024-12-02' },
  { id: 'a8', name: 'Risk Management Plan', description: 'Risk register with mitigation strategies', type: 'optional', status: 'pending', generatedBySystem: true },
  { id: 'a9', name: 'Gender Equality Plan', description: 'Institutional GEP documentation', type: 'optional', status: 'not_required', generatedBySystem: false },
  { id: 'a10', name: 'Security Classification', description: 'Security aspect of the project', type: 'not_applicable', status: 'not_required', generatedBySystem: false },
];

export default function Annexes() {
  const mandatory = annexes.filter(a => a.type === 'mandatory');
  const conditional = annexes.filter(a => a.type === 'conditional');
  const optional = annexes.filter(a => a.type === 'optional');
  const notApplicable = annexes.filter(a => a.type === 'not_applicable');

  const completedCount = annexes.filter(a => a.status === 'completed').length;
  const totalApplicable = annexes.filter(a => a.type !== 'not_applicable').length;

  const getStatusIcon = (status: Annex['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'in_progress': return <Clock size={14} className="text-amber-500" />;
      case 'pending': return <AlertCircle size={14} className="text-slate-400" />;
      case 'not_required': return <XCircle size={14} className="text-slate-300" />;
    }
  };

  const getTypeBadge = (type: Annex['type']) => {
    switch (type) {
      case 'mandatory': return 'bg-red-100 text-red-700';
      case 'conditional': return 'bg-amber-100 text-amber-700';
      case 'optional': return 'bg-blue-100 text-blue-700';
      case 'not_applicable': return 'bg-slate-100 text-slate-500';
    }
  };

  const renderSection = (title: string, items: Annex[]) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-sm">{title} ({items.length})</h3>
        <span className="text-xs text-slate-500">
          {items.filter(i => i.status === 'completed').length}/{items.length} completed
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((annex) => (
          <div key={annex.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              {getStatusIcon(annex.status)}
              <div>
                <p className="text-sm font-medium text-slate-700">{annex.name}</p>
                <p className="text-xs text-slate-500">{annex.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeBadge(annex.type)}`}>
                {annex.type}
              </span>
              {annex.generatedBySystem && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-100 text-violet-700">Auto-gen</span>
              )}
              {annex.lastModified && (
                <span className="text-[10px] text-slate-400">{annex.lastModified}</span>
              )}
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                {annex.status === 'pending' ? <Upload size={14} /> : <FileText size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Annexes</h1>
          <p className="text-slate-500 mt-1">Track and manage required supporting documents</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Document Completion</h3>
          <span className="text-sm font-medium text-primary-600">{completedCount}/{totalApplicable}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full" style={{ width: `${(completedCount / totalApplicable) * 100}%` }}></div>
        </div>
      </div>

      {/* Sections */}
      {renderSection('Mandatory Annexes', mandatory)}
      {renderSection('Conditional Annexes', conditional)}
      {renderSection('Optional Annexes', optional)}
      {renderSection('Not Applicable', notApplicable)}

      {/* Pending Actions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <AlertCircle size={16} />
          Documents Requiring Action
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            CVs of Key Personnel — 3 of 5 CVs uploaded, need OXFORD and POLIMI
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            Letters of Support — Awaiting endorsement from 2 industry partners
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            Risk Management Plan — Not started, auto-generation available
          </li>
        </ul>
      </div>
    </div>
  );
}

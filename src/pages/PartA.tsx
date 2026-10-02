import { useState } from 'react';
import { FileText, CheckCircle2, AlertCircle, Edit3, Download, Save, ChevronDown, ChevronRight } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  status: 'complete' | 'partial' | 'empty' | 'error';
  charCount: number;
  charLimit: number;
  content: string;
}

const sections: Section[] = [
  { id: 'gen-info', title: '1. General Information', status: 'complete', charCount: 2400, charLimit: 3000, content: 'Project QUANTUM-CLIM addresses the critical challenge of climate prediction accuracy through quantum computing...' },
  { id: 'participants', title: '2. Participants', status: 'complete', charCount: 5000, charLimit: 5000, content: '5 beneficiaries from 4 EU Member States. Coordinator: European Research Institute (Germany)...' },
  { id: 'admin-data', title: '3. Administrative Data', status: 'partial', charCount: 1200, charLimit: 2000, content: 'Legal entity information registered. VAT numbers pending verification for 2 participants...' },
  { id: 'budget-info', title: '4. Budget Information', status: 'partial', charCount: 3500, charLimit: 5000, content: 'Total eligible costs: €8,500,000. Requested EU contribution: €7,225,000 (85%)...' },
  { id: 'ethics', title: '5. Ethics', status: 'complete', charCount: 800, charLimit: 2000, content: 'No ethics issues identified. The project does not involve human subjects, animals, or dual-use research...' },
  { id: 'security', title: '6. Security', status: 'empty', charCount: 0, charLimit: 2000, content: '' },
  { id: 'declarations', title: '7. Declarations', status: 'error', charCount: 0, charLimit: 0, content: 'Mandatory declarations not yet signed by legal representative...' },
];

export default function PartA() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const completedCount = sections.filter(s => s.status === 'complete').length;
  const totalSections = sections.length;
  const completionPercent = Math.round((completedCount / totalSections) * 100);

  const getStatusIcon = (status: Section['status']) => {
    switch (status) {
      case 'complete': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'partial': return <AlertCircle size={14} className="text-amber-500" />;
      case 'empty': return <AlertCircle size={14} className="text-slate-400" />;
      case 'error': return <AlertCircle size={14} className="text-red-500" />;
    }
  };

  const getStatusColor = (status: Section['status']) => {
    switch (status) {
      case 'complete': return 'border-l-emerald-500';
      case 'partial': return 'border-l-amber-500';
      case 'empty': return 'border-l-slate-300';
      case 'error': return 'border-l-red-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Part A — Administrative Form</h1>
          <p className="text-slate-500 mt-1">Complete the administrative sections of your proposal</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download size={14} />
            Export PDF
          </button>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Completion Progress</h3>
          <span className="text-sm font-medium text-primary-600">{completionPercent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all" style={{ width: `${completionPercent}%` }}></div>
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> {completedCount} Complete</span>
          <span className="flex items-center gap-1"><AlertCircle size={10} className="text-amber-500" /> {sections.filter(s => s.status === 'partial').length} Partial</span>
          <span className="flex items-center gap-1"><AlertCircle size={10} className="text-red-500" /> {sections.filter(s => s.status === 'error').length} Errors</span>
          <span className="flex items-center gap-1"><AlertCircle size={10} className="text-slate-400" /> {sections.filter(s => s.status === 'empty').length} Empty</span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className={`bg-white rounded-xl border border-slate-200 border-l-4 ${getStatusColor(section.status)} overflow-hidden`}>
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(section.status)}
                <span className="font-medium text-slate-800 text-sm">{section.title}</span>
              </div>
              <div className="flex items-center gap-4">
                {section.charLimit > 0 && (
                  <span className={`text-xs ${section.charCount >= section.charLimit ? 'text-red-500' : 'text-slate-400'}`}>
                    {section.charCount}/{section.charLimit} chars
                  </span>
                )}
                {activeSection === section.id ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
              </div>
            </button>
            {activeSection === section.id && (
              <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                {editMode ? (
                  <textarea
                    defaultValue={section.content}
                    rows={8}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                    placeholder={`Enter content for ${section.title}...`}
                  />
                ) : (
                  <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4 min-h-[100px]">
                    {section.content || <span className="text-slate-400 italic">No content yet. Click Edit to start.</span>}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg flex items-center gap-1"
                    >
                      <Edit3 size={12} />
                      {editMode ? 'Preview' : 'Edit'}
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                      <FileText size={12} />
                      Auto-generate with AI
                    </button>
                  </div>
                  {section.charLimit > 0 && (
                    <div className={`text-xs ${section.charCount >= section.charLimit * 0.9 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {section.charLimit - section.charCount} characters remaining
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Validation Summary */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <AlertCircle size={16} />
          Pending Items
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            Security section (Section 6) is empty — required for this call
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            Declarations (Section 7) need legal representative signature
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            Administrative Data: VAT verification pending for 2 participants
          </li>
        </ul>
      </div>
    </div>
  );
}

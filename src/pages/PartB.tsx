import { useState } from 'react';
import { PenTool, FileText, Download, Save, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';

interface PartBSection {
  id: string;
  title: string;
  subsection: string;
  charCount: number;
  charLimit: number;
  content: string;
  status: 'complete' | 'draft' | 'empty';
}

const sections: PartBSection[] = [
  {
    id: 'excellence',
    title: '1. Excellence',
    subsection: '1.1 Objectives',
    charCount: 4200,
    charLimit: 5000,
    content: 'The project aims to develop quantum-enhanced algorithms for atmospheric modelling that will enable unprecedented accuracy in climate predictions...',
    status: 'complete',
  },
  {
    id: 'excellence-2',
    title: '1. Excellence',
    subsection: '1.2 Beyond State of the Art',
    charCount: 3800,
    charLimit: 5000,
    content: 'Current climate models rely on classical computing paradigms that face fundamental limitations in handling the complexity of atmospheric dynamics...',
    status: 'complete',
  },
  {
    id: 'excellence-3',
    title: '1. Excellence',
    subsection: '1.3 Methodology',
    charCount: 2100,
    charLimit: 5000,
    content: 'Our methodology combines variational quantum algorithms with classical weather prediction models through a hybrid computing framework...',
    status: 'draft',
  },
  {
    id: 'impact',
    title: '2. Impact',
    subsection: '2.1 Expected Outcomes',
    charCount: 3500,
    charLimit: 5000,
    content: 'The project will deliver a quantum-enhanced climate simulation framework capable of 100x speedup for specific atmospheric processes...',
    status: 'complete',
  },
  {
    id: 'impact-2',
    title: '2. Impact',
    subsection: '2.2 Pathway to Impact',
    charCount: 1800,
    charLimit: 5000,
    content: 'Impact will be achieved through three pathways: scientific publications, open-source software release, and policy engagement...',
    status: 'draft',
  },
  {
    id: 'implementation',
    title: '3. Quality & Efficiency of Implementation',
    subsection: '3.1 Work Plan',
    charCount: 4500,
    charLimit: 5000,
    content: 'The work plan is organized into 6 Work Packages spanning the 48-month project duration, with clear milestones and deliverables...',
    status: 'complete',
  },
  {
    id: 'implementation-2',
    title: '3. Quality & Efficiency of Implementation',
    subsection: '3.2 Risk Management',
    charCount: 0,
    charLimit: 3000,
    content: '',
    status: 'empty',
  },
];

export default function PartB() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.title]) acc[section.title] = [];
    acc[section.title].push(section);
    return acc;
  }, {} as Record<string, PartBSection[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Part B — Technical Narrative</h1>
          <p className="text-slate-500 mt-1">Write the scientific and technical sections of your proposal</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download size={14} />
            Export DOCX
          </button>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* Template Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <PenTool size={18} className="text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Horizon Europe Standard Template</p>
          <p className="text-xs text-blue-600 mt-1">Excellence (max 17 pages) • Impact (max 15 pages) • Implementation (max 18 pages)</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {Object.entries(groupedSections).map(([title, items]) => (
          <div key={title} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
            </div>
            {items.map((section) => (
              <div key={section.id} className="border-b border-slate-100 last:border-b-0">
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      section.status === 'complete' ? 'bg-emerald-500' :
                      section.status === 'draft' ? 'bg-amber-500' : 'bg-slate-300'
                    }`}></span>
                    <span className="text-sm text-slate-700">{section.subsection}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs ${section.charCount >= section.charLimit ? 'text-red-500' : 'text-slate-400'}`}>
                      {section.charCount}/{section.charLimit}
                    </span>
                    {activeSection === section.id ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                  </div>
                </button>
                {activeSection === section.id && (
                  <div className="px-5 pb-4 pt-2">
                    {editMode ? (
                      <textarea
                        defaultValue={section.content}
                        rows={10}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                        placeholder={`Write content for ${section.subsection}...`}
                      />
                    ) : (
                      <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4 min-h-[120px]">
                        {section.content || <span className="text-slate-400 italic">No content yet.</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditMode(!editMode)}
                          className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          {editMode ? 'Preview' : 'Edit'}
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 rounded-lg flex items-center gap-1">
                          <Sparkles size={12} />
                          AI Assist
                        </button>
                      </div>
                      <span className={`text-xs ${section.charCount >= section.charLimit * 0.9 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {section.charLimit - section.charCount} chars remaining
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Page Counter */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Page Usage by Section</h3>
        <div className="space-y-3">
          {[
            { name: 'Excellence', used: 12, max: 17 },
            { name: 'Impact', used: 8, max: 15 },
            { name: 'Implementation', used: 9, max: 18 },
          ].map((section) => (
            <div key={section.name} className="flex items-center gap-4">
              <span className="text-sm text-slate-600 w-32">{section.name}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${section.used / section.max > 0.9 ? 'bg-amber-500' : 'bg-primary-500'}`}
                  style={{ width: `${(section.used / section.max) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-500 w-16 text-right">{section.used}/{section.max} pages</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

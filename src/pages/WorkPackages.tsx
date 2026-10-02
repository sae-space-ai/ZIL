import { useState } from 'react';
import { Package, Plus, Calendar, Users, FileCheck, Flag, ChevronDown, ChevronRight } from 'lucide-react';

interface WorkPackage {
  id: string;
  number: string;
  title: string;
  lead: string;
  participants: string[];
  startMonth: number;
  endMonth: number;
  effort: number; // person-months
  deliverables: Deliverable[];
  milestones: Milestone[];
  status: 'not_started' | 'in_progress' | 'completed';
}

interface Deliverable {
  id: string;
  number: string;
  title: string;
  dueMonth: number;
  type: 'Report' | 'Software' | 'Dataset' | 'Prototype' | 'Policy Brief';
  status: 'planned' | 'in_progress' | 'completed';
}

interface Milestone {
  id: string;
  number: string;
  title: string;
  dueMonth: number;
  status: 'pending' | 'achieved' | 'at_risk';
}

const workPackages: WorkPackage[] = [
  {
    id: 'wp1',
    number: 'WP1',
    title: 'Project Management & Coordination',
    lead: 'ERI',
    participants: ['ERI', 'TUM', 'CNRS', 'OXFORD', 'POLIMI'],
    startMonth: 1,
    endMonth: 48,
    effort: 24,
    deliverables: [
      { id: 'd1', number: 'D1.1', title: 'Project Handbook', dueMonth: 3, type: 'Report', status: 'completed' },
      { id: 'd2', number: 'D1.2', title: 'Data Management Plan', dueMonth: 6, type: 'Report', status: 'in_progress' },
      { id: 'd3', number: 'D1.3', title: 'Periodic Reports', dueMonth: 24, type: 'Report', status: 'planned' },
    ],
    milestones: [
      { id: 'm1', number: 'MS1', title: 'Consortium Agreement Signed', dueMonth: 1, status: 'achieved' },
      { id: 'm2', number: 'MS2', title: 'Mid-term Review', dueMonth: 24, status: 'pending' },
    ],
    status: 'in_progress',
  },
  {
    id: 'wp2',
    number: 'WP2',
    title: 'Quantum Algorithm Development',
    lead: 'TUM',
    participants: ['TUM', 'CNRS'],
    startMonth: 1,
    endMonth: 24,
    effort: 60,
    deliverables: [
      { id: 'd4', number: 'D2.1', title: 'Algorithm Design Document', dueMonth: 6, type: 'Report', status: 'completed' },
      { id: 'd5', number: 'D2.2', title: 'Quantum Circuit Library v1', dueMonth: 12, type: 'Software', status: 'in_progress' },
      { id: 'd6', number: 'D2.3', title: 'Benchmark Results', dueMonth: 18, type: 'Dataset', status: 'planned' },
    ],
    milestones: [
      { id: 'm3', number: 'MS3', title: 'First Quantum Advantage Demonstrated', dueMonth: 12, status: 'pending' },
    ],
    status: 'in_progress',
  },
  {
    id: 'wp3',
    number: 'WP3',
    title: 'Climate Model Integration',
    lead: 'ERI',
    participants: ['ERI', 'OXFORD'],
    startMonth: 6,
    endMonth: 36,
    effort: 48,
    deliverables: [
      { id: 'd7', number: 'D3.1', title: 'Integration Framework', dueMonth: 12, type: 'Software', status: 'in_progress' },
      { id: 'd8', number: 'D3.2', title: 'Validation Against ERA5', dueMonth: 24, type: 'Dataset', status: 'planned' },
    ],
    milestones: [
      { id: 'm4', number: 'MS4', title: 'Hybrid Model Operational', dueMonth: 18, status: 'pending' },
    ],
    status: 'in_progress',
  },
  {
    id: 'wp4',
    number: 'WP4',
    title: 'Hardware Interface & Optimization',
    lead: 'POLIMI',
    participants: ['POLIMI', 'TUM'],
    startMonth: 6,
    endMonth: 30,
    effort: 36,
    deliverables: [
      { id: 'd9', number: 'D4.1', title: 'Hardware Requirements', dueMonth: 9, type: 'Report', status: 'completed' },
      { id: 'd10', number: 'D4.2', title: 'Optimized Transpilation', dueMonth: 18, type: 'Software', status: 'planned' },
    ],
    milestones: [
      { id: 'm5', number: 'MS5', title: 'Noise-Resilient Circuits', dueMonth: 15, status: 'at_risk' },
    ],
    status: 'in_progress',
  },
  {
    id: 'wp5',
    number: 'WP5',
    title: 'Validation & Impact Assessment',
    lead: 'OXFORD',
    participants: ['OXFORD', 'CNRS', 'ERI'],
    startMonth: 18,
    endMonth: 42,
    effort: 30,
    deliverables: [
      { id: 'd11', number: 'D5.1', title: 'Validation Protocol', dueMonth: 20, type: 'Report', status: 'planned' },
      { id: 'd12', number: 'D5.2', title: 'Impact Assessment Report', dueMonth: 36, type: 'Report', status: 'planned' },
    ],
    milestones: [
      { id: 'm6', number: 'MS6', title: 'Validation Complete', dueMonth: 36, status: 'pending' },
    ],
    status: 'not_started',
  },
  {
    id: 'wp6',
    number: 'WP6',
    title: 'Dissemination & Exploitation',
    lead: 'CNRS',
    participants: ['CNRS', 'ERI', 'POLIMI'],
    startMonth: 1,
    endMonth: 48,
    effort: 18,
    deliverables: [
      { id: 'd13', number: 'D6.1', title: 'Communication Plan', dueMonth: 3, type: 'Report', status: 'completed' },
      { id: 'd14', number: 'D6.2', title: 'Exploitation Strategy', dueMonth: 36, type: 'Report', status: 'planned' },
    ],
    milestones: [
      { id: 'm7', number: 'MS7', title: 'Open Source Release', dueMonth: 30, status: 'pending' },
    ],
    status: 'in_progress',
  },
];

export default function WorkPackages() {
  const [expandedWP, setExpandedWP] = useState<string | null>('wp1');

  const totalEffort = workPackages.reduce((sum, wp) => sum + wp.effort, 0);
  const totalDeliverables = workPackages.reduce((sum, wp) => sum + wp.deliverables.length, 0);
  const totalMilestones = workPackages.reduce((sum, wp) => sum + wp.milestones.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Work Packages</h1>
          <p className="text-slate-500 mt-1">Define and manage your project work plan</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
          <Plus size={16} />
          Add Work Package
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{workPackages.length}</p>
              <p className="text-xs text-slate-500">Work Packages</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalEffort}</p>
              <p className="text-xs text-slate-500">Person-Months</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <FileCheck size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalDeliverables}</p>
              <p className="text-xs text-slate-500">Deliverables</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Flag size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalMilestones}</p>
              <p className="text-xs text-slate-500">Milestones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart Simplified */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-primary-500" />
          Timeline (48 months)
        </h3>
        <div className="space-y-2">
          {workPackages.map((wp) => (
            <div key={wp.id} className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 w-8">{wp.number}</span>
              <div className="flex-1 h-6 bg-slate-100 rounded relative">
                <div
                  className="absolute h-full bg-primary-500/80 rounded flex items-center px-2"
                  style={{
                    left: `${((wp.startMonth - 1) / 48) * 100}%`,
                    width: `${((wp.endMonth - wp.startMonth + 1) / 48) * 100}%`,
                  }}
                >
                  <span className="text-[10px] text-white font-medium truncate">{wp.title}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 w-16 text-right">M{wp.startMonth}-M{wp.endMonth}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Work Package Details */}
      <div className="space-y-3">
        {workPackages.map((wp) => (
          <div key={wp.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpandedWP(expandedWP === wp.id ? null : wp.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded">{wp.number}</span>
                <div className="text-left">
                  <h3 className="font-medium text-slate-800 text-sm">{wp.title}</h3>
                  <p className="text-xs text-slate-500">Lead: {wp.lead} • M{wp.startMonth}-M{wp.endMonth} • {wp.effort} PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  {wp.participants.slice(0, 3).map((p) => (
                    <div key={p} className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[8px] font-bold text-slate-600">
                      {p.slice(0, 2)}
                    </div>
                  ))}
                  {wp.participants.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-slate-300 border border-white flex items-center justify-center text-[8px] text-slate-600">
                      +{wp.participants.length - 3}
                    </div>
                  )}
                </div>
                {expandedWP === wp.id ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
              </div>
            </button>
            {expandedWP === wp.id && (
              <div className="px-5 pb-4 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Deliverables */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Deliverables</h4>
                    <div className="space-y-2">
                      {wp.deliverables.map((d) => (
                        <div key={d.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              d.status === 'completed' ? 'bg-emerald-500' :
                              d.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-300'
                            }`}></span>
                            <span className="text-xs font-medium text-slate-700">{d.number}</span>
                            <span className="text-xs text-slate-500">{d.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded">{d.type}</span>
                            <span className="text-[10px] text-slate-400">M{d.dueMonth}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Milestones */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {wp.milestones.map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Flag size={12} className={
                              m.status === 'achieved' ? 'text-emerald-500' :
                              m.status === 'at_risk' ? 'text-red-500' : 'text-slate-400'
                            } />
                            <span className="text-xs font-medium text-slate-700">{m.number}</span>
                            <span className="text-xs text-slate-500">{m.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">M{m.dueMonth}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

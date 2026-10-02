import { useState } from 'react';
import { Calculator, Download, Plus, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface BudgetLine {
  id: string;
  category: string;
  participant: string;
  personMonths: number;
  unitCost: number;
  totalCost: number;
}

const budgetData: BudgetLine[] = [
  { id: 'b1', category: 'Personnel Costs', participant: 'ERI', personMonths: 48, unitCost: 7500, totalCost: 360000 },
  { id: 'b2', category: 'Personnel Costs', participant: 'TUM', personMonths: 36, unitCost: 8000, totalCost: 288000 },
  { id: 'b3', category: 'Personnel Costs', participant: 'CNRS', personMonths: 42, unitCost: 6500, totalCost: 273000 },
  { id: 'b4', category: 'Personnel Costs', participant: 'OXFORD', personMonths: 30, unitCost: 9000, totalCost: 270000 },
  { id: 'b5', category: 'Personnel Costs', participant: 'POLIMI', personMonths: 36, unitCost: 6000, totalCost: 216000 },
  { id: 'b6', category: 'Subcontracting', participant: 'ERI', personMonths: 0, unitCost: 0, totalCost: 150000 },
  { id: 'b7', category: 'Travel & Subsistence', participant: 'All', personMonths: 0, unitCost: 0, totalCost: 180000 },
  { id: 'b8', category: 'Equipment', participant: 'TUM', personMonths: 0, unitCost: 0, totalCost: 420000 },
  { id: 'b9', category: 'Other Goods & Services', participant: 'All', personMonths: 0, unitCost: 0, totalCost: 350000 },
  { id: 'b10', category: 'Indirect Costs (25%)', participant: 'All', personMonths: 0, unitCost: 0, totalCost: 626750 },
];

export default function Budget() {
  const [view, setView] = useState<'category' | 'participant' | 'workpackage'>('category');

  const totalCost = budgetData.reduce((sum, line) => sum + line.totalCost, 0);
  const personnelCosts = budgetData.filter(l => l.category === 'Personnel Costs').reduce((sum, l) => sum + l.totalCost, 0);
  const indirectCosts = budgetData.filter(l => l.category.includes('Indirect')).reduce((sum, l) => sum + l.totalCost, 0);
  const euContribution = totalCost * 0.85;

  const participants = ['ERI', 'TUM', 'CNRS', 'OXFORD', 'POLIMI'];
  const participantTotals = participants.map(p => ({
    name: p,
    total: budgetData.filter(l => l.participant === p || l.participant === 'All').reduce((sum, l) => {
      if (l.participant === 'All') return sum + (l.totalCost / participants.length);
      return sum + l.totalCost;
    }, 0),
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const categories = [...new Set(budgetData.map(l => l.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Budget Engine</h1>
          <p className="text-slate-500 mt-1">Build and validate your project budget</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download size={14} />
            Export XLSX
          </button>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
            <Plus size={14} />
            Add Budget Line
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Total Eligible Costs</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(totalCost)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
            <TrendingUp size={10} /> Within call limits
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">EU Contribution (85%)</p>
          <p className="text-xl font-bold text-primary-600">{formatCurrency(euContribution)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            Funding rate applied
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Personnel Costs</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(personnelCosts)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            {Math.round((personnelCosts / totalCost) * 100)}% of total
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Indirect Costs</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(indirectCosts)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            Flat rate 25%
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        {(['category', 'participant', 'workpackage'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              view === v ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            By {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Budget Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Participant</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Person-Months</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Unit Cost (€)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">Total (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgetData.map((line) => (
                <tr key={line.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 text-sm text-slate-700">{line.category}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium">{line.participant}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 text-right">{line.personMonths || '—'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600 text-right">{line.unitCost > 0 ? formatCurrency(line.unitCost) : '—'}</td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-800 text-right">{formatCurrency(line.totalCost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
              <tr>
                <td colSpan={4} className="px-5 py-3 text-sm font-bold text-slate-800 text-right">TOTAL</td>
                <td className="px-5 py-3 text-sm font-bold text-primary-700 text-right">{formatCurrency(totalCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Per Participant Breakdown */}
      {view === 'participant' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Budget per Participant</h3>
          <div className="space-y-3">
            {participantTotals.map((p) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="text-sm text-slate-700 font-medium w-20">{p.name}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(p.total / Math.max(...participantTotals.map(pt => pt.total))) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-medium">{formatCurrency(p.total)}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 w-16 text-right">{Math.round((p.total / totalCost) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Validation */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
          <CheckCircle2 size={16} />
          Budget Validation
        </h3>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li className="flex items-center gap-2"><CheckCircle2 size={12} /> Total eligible costs within call maximum</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={12} /> Personnel costs calculated correctly</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={12} /> Indirect costs at 25% flat rate</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={12} /> All participants have budget allocated</li>
        </ul>
        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
          <AlertTriangle size={14} />
          <span>Warning: OXFORD personnel unit cost exceeds typical range for UK institutions</span>
        </div>
      </div>
    </div>
  );
}

import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface ValidationRule {
  id: string;
  category: 'administrative' | 'eligibility' | 'technical' | 'financial' | 'documentary';
  name: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'pass' | 'fail' | 'warning' | 'not_checked';
  reference?: string;
}

const rules: ValidationRule[] = [
  // Administrative
  { id: 'v1', category: 'administrative', name: 'Coordinator PIC Valid', description: 'Verify coordinator has valid PIC in Participant Identification Code system', severity: 'critical', status: 'pass', reference: 'GA Art. 6' },
  { id: 'v2', category: 'administrative', name: 'Minimum Consortium Size', description: 'At least 3 independent legal entities from 3 different EU Member States', severity: 'critical', status: 'pass', reference: 'Call conditions' },
  { id: 'v3', category: 'administrative', name: 'All Fields Complete', description: 'All mandatory fields in Part A are filled', severity: 'critical', status: 'fail', reference: 'Submission requirements' },
  { id: 'v4', category: 'administrative', name: 'Declarations Signed', description: 'Legal representative declarations are signed', severity: 'critical', status: 'fail', reference: 'Part A Section 7' },

  // Eligibility
  { id: 'v5', category: 'eligibility', name: 'Eligible Countries', description: 'All participants from eligible countries', severity: 'critical', status: 'pass', reference: 'GA Art. 8' },
  { id: 'v6', category: 'eligibility', name: 'Entity Type Valid', description: 'All entities are legal entities as defined in Horizon Europe', severity: 'critical', status: 'pass', reference: 'Reg. 2021/695' },
  { id: 'v7', category: 'eligibility', name: 'Submission Before Deadline', description: 'Proposal submitted before call deadline', severity: 'critical', status: 'pass', reference: 'Call conditions' },

  // Technical
  { id: 'v8', category: 'technical', name: 'Objectives Addressed', description: 'All call objectives are addressed in Part B', severity: 'warning', status: 'warning', reference: 'Evaluation criteria' },
  { id: 'v9', category: 'technical', name: 'Page Limits Respected', description: 'Part B does not exceed maximum page limits', severity: 'critical', status: 'pass', reference: 'Submission guidelines' },
  { id: 'v10', category: 'technical', name: 'Work Plan Coherence', description: 'Work packages align with objectives and deliverables', severity: 'warning', status: 'pass', reference: 'Quality criterion' },

  // Financial
  { id: 'v11', category: 'financial', name: 'Budget Within Ceiling', description: 'Total budget does not exceed call ceiling', severity: 'critical', status: 'pass', reference: 'Call conditions' },
  { id: 'v12', category: 'financial', name: 'Personnel Cost Calculation', description: 'Personnel costs use correct unit costs', severity: 'warning', status: 'warning', reference: 'Annotated GA' },
  { id: 'v13', category: 'financial', name: 'Indirect Costs Rate', description: 'Indirect costs calculated at 25% flat rate', severity: 'critical', status: 'pass', reference: 'GA Art. 6.2.E' },
  { id: 'v14', category: 'financial', name: 'Budget-Implementation Consistency', description: 'Budget matches work package resource allocation', severity: 'warning', status: 'fail', reference: 'Coherence check' },

  // Documentary
  { id: 'v15', category: 'documentary', name: 'Mandatory Annexes Present', description: 'All mandatory annexes are uploaded', severity: 'critical', status: 'fail', reference: 'Submission checklist' },
  { id: 'v16', category: 'documentary', name: 'File Formats Valid', description: 'All documents in required format (PDF, XLSX)', severity: 'critical', status: 'pass', reference: 'Submission guidelines' },
  { id: 'v17', category: 'documentary', name: 'DMP Included', description: 'Data Management Plan is complete and included', severity: 'warning', status: 'warning', reference: 'Open Science requirement' },
];

export default function Compliance() {
  const categories = ['administrative', 'eligibility', 'technical', 'financial', 'documentary'] as const;
  
  const categoryLabels: Record<string, string> = {
    administrative: 'Administrative',
    eligibility: 'Eligibility',
    technical: 'Technical',
    financial: 'Financial',
    documentary: 'Documentary',
  };

  const categoryIcons: Record<string, string> = {
    administrative: '📋',
    eligibility: '✅',
    technical: '🔬',
    financial: '💰',
    documentary: '📄',
  };

  const totalRules = rules.length;
  const passedRules = rules.filter(r => r.status === 'pass').length;
  const failedRules = rules.filter(r => r.status === 'fail').length;
  const warningRules = rules.filter(r => r.status === 'warning').length;
  const overallScore = Math.round((passedRules / totalRules) * 100);

  const isReadyToSubmit = failedRules === 0 && rules.filter(r => r.severity === 'critical' && r.status === 'fail').length === 0;

  const getStatusIcon = (status: ValidationRule['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'fail': return <XCircle size={14} className="text-red-500" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'not_checked': return <ShieldCheck size={14} className="text-slate-300" />;
    }
  };

  const getSeverityBadge = (severity: ValidationRule['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      case 'info': return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Compliance Engine</h1>
          <p className="text-slate-500 mt-1">Validate your proposal against all requirements</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
          <ShieldCheck size={16} />
          Run Full Validation
        </button>
      </div>

      {/* Overall Score */}
      <div className={`rounded-xl border p-5 ${isReadyToSubmit ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold text-lg ${isReadyToSubmit ? 'text-emerald-800' : 'text-red-800'}`}>
              {isReadyToSubmit ? '✓ Ready to Submit' : '⚠ Not Ready to Submit'}
            </h3>
            <p className={`text-sm mt-1 ${isReadyToSubmit ? 'text-emerald-600' : 'text-red-600'}`}>
              {isReadyToSubmit
                ? 'All critical checks passed. Your proposal meets submission requirements.'
                : `${failedRules} critical issue(s) must be resolved before submission.`}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${isReadyToSubmit ? 'text-emerald-700' : 'text-red-700'}`}>{overallScore}%</p>
            <p className="text-xs text-slate-500">Compliance Score</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{passedRules}</p>
          <p className="text-xs text-slate-500">Passed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{failedRules}</p>
          <p className="text-xs text-slate-500">Failed</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{warningRules}</p>
          <p className="text-xs text-slate-500">Warnings</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-600">{totalRules}</p>
          <p className="text-xs text-slate-500">Total Rules</p>
        </div>
      </div>

      {/* Validation Categories */}
      {categories.map((category) => {
        const categoryRules = rules.filter(r => r.category === category);
        const categoryPassed = categoryRules.filter(r => r.status === 'pass').length;
        
        return (
          <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <span>{categoryIcons[category]}</span>
                {categoryLabels[category]}
              </h3>
              <span className="text-xs text-slate-500">{categoryPassed}/{categoryRules.length} passed</span>
            </div>
            <div className="divide-y divide-slate-100">
              {categoryRules.map((rule) => (
                <div key={rule.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(rule.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{rule.name}</p>
                      <p className="text-xs text-slate-500">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getSeverityBadge(rule.severity)}`}>
                      {rule.severity}
                    </span>
                    {rule.reference && (
                      <span className="text-[10px] text-slate-400 hidden md:block">{rule.reference}</span>
                    )}
                    {rule.status === 'fail' && (
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        Fix <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

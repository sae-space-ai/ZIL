import { Send, Download, FileArchive, CheckCircle2, AlertCircle, Clock, FileText, Package } from 'lucide-react';

interface SubmissionDocument {
  id: string;
  name: string;
  type: string;
  status: 'ready' | 'pending' | 'validating' | 'validated';
  size?: string;
  version: string;
}

const documents: SubmissionDocument[] = [
  { id: 'sd1', name: 'Part A - Administrative Form', type: 'PDF', status: 'validated', size: '2.4 MB', version: 'v3' },
  { id: 'sd2', name: 'Part B - Technical Narrative', type: 'PDF', status: 'validated', size: '8.1 MB', version: 'v5' },
  { id: 'sd3', name: 'Budget Table (Official Template)', type: 'XLSX', status: 'validated', size: '340 KB', version: 'v4' },
  { id: 'sd4', name: 'Budget Justification', type: 'PDF', status: 'validated', size: '1.2 MB', version: 'v2' },
  { id: 'sd5', name: 'Gantt Chart', type: 'PDF', status: 'validated', size: '520 KB', version: 'v2' },
  { id: 'sd6', name: 'Data Management Plan', type: 'PDF', status: 'pending', size: '—', version: 'v1' },
  { id: 'sd7', name: 'CVs - Key Personnel', type: 'PDF', status: 'pending', size: '—', version: '—' },
  { id: 'sd8', name: 'Ethics Self-Assessment', type: 'PDF', status: 'validated', size: '890 KB', version: 'v1' },
  { id: 'sd9', name: 'Letters of Support', type: 'PDF', status: 'pending', size: '—', version: '—' },
  { id: 'sd10', name: 'Participant Declaration Forms', type: 'PDF', status: 'pending', size: '—', version: '—' },
];

export default function Submission() {
  const readyDocs = documents.filter(d => d.status === 'validated');
  const pendingDocs = documents.filter(d => d.status === 'pending');
  const totalReady = readyDocs.length;
  const totalPending = pendingDocs.length;
  const isComplete = totalPending === 0;

  const getStatusIcon = (status: SubmissionDocument['status']) => {
    switch (status) {
      case 'validated': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'ready': return <Clock size={14} className="text-blue-500" />;
      case 'pending': return <AlertCircle size={14} className="text-amber-500" />;
      case 'validating': return <Clock size={14} className="text-violet-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: SubmissionDocument['status']) => {
    switch (status) {
      case 'validated': return 'bg-emerald-100 text-emerald-700';
      case 'ready': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'validating': return 'bg-violet-100 text-violet-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Submission Package</h1>
          <p className="text-slate-500 mt-1">Prepare and download your complete submission package</p>
        </div>
        <button
          disabled={!isComplete}
          className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
            isComplete
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send size={16} />
          Generate Submission Package
        </button>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl border p-5 ${isComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold ${isComplete ? 'text-emerald-800' : 'text-amber-800'}`}>
              {isComplete ? '📦 Package Ready for Assembly' : '⚠ Package Incomplete'}
            </h3>
            <p className={`text-sm mt-1 ${isComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isComplete
                ? 'All documents validated. Ready to generate ZIP package.'
                : `${totalPending} document(s) pending. Complete all items to generate the package.`}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${isComplete ? 'text-emerald-700' : 'text-amber-700'}`}>
              {totalReady}/{documents.length}
            </p>
            <p className="text-xs text-slate-500">Documents Ready</p>
          </div>
        </div>
      </div>

      {/* Document Manifest */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <FileText size={16} className="text-primary-500" />
            Document Manifest
          </h3>
          <span className="text-xs text-slate-500">QUANTUM-CLIM • HORIZON-CL5-2024-CL3-01</span>
        </div>
        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-3">
                {getStatusIcon(doc.status)}
                <div>
                  <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.type} {doc.size && `• ${doc.size}`} {doc.version !== '—' && `• ${doc.version}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(doc.status)}`}>
                  {doc.status}
                </span>
                {doc.status === 'validated' && (
                  <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                    <Download size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Contents Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileArchive size={16} className="text-primary-500" />
          Package Structure (ZIP)
        </h3>
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-xs text-slate-600 space-y-1">
          <p className="text-slate-800 font-bold">QUANTUM-CLIM_Submission_Package/</p>
          <p className="pl-4">├── 01_Administrative/</p>
          <p className="pl-8">│   ├── Part_A_Administrative_Form.pdf</p>
          <p className="pl-8">│   └── Participant_Declarations.pdf</p>
          <p className="pl-4">├── 02_Technical/</p>
          <p className="pl-8">│   ├── Part_B_Technical_Narrative.pdf</p>
          <p className="pl-8">│   └── Gantt_Chart.pdf</p>
          <p className="pl-4">├── 03_Budget/</p>
          <p className="pl-8">│   ├── Budget_Table_Official.xlsx</p>
          <p className="pl-8">│   └── Budget_Justification.pdf</p>
          <p className="pl-4">├── 04_Annexes/</p>
          <p className="pl-8">│   ├── Data_Management_Plan.pdf</p>
          <p className="pl-8">│   ├── CVs_Key_Personnel.pdf</p>
          <p className="pl-8">│   ├── Ethics_Self_Assessment.pdf</p>
          <p className="pl-8">│   └── Letters_of_Support.pdf</p>
          <p className="pl-4">├── 05_Validation/</p>
          <p className="pl-8">│   └── Compliance_Report.pdf</p>
          <p className="pl-4">└── README_Manifest.txt</p>
        </div>
      </div>

      {/* Pending Actions */}
      {totalPending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Package size={16} />
            Pending Documents ({totalPending})
          </h3>
          <div className="space-y-2">
            {pendingDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span className="text-sm text-slate-700">{doc.name}</span>
                </div>
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Go to Annexes →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Individual Downloads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {readyDocs.map((doc) => (
            <button
              key={doc.id}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">{doc.name}</span>
              </div>
              <Download size={14} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

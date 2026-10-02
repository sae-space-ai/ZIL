import { useState } from 'react';
import { Users, Plus, Building2, Globe, Mail, Phone, X, Search } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  shortName: string;
  type: 'beneficiary' | 'affiliated' | 'associated' | 'third_party';
  country: string;
  pic?: string;
  vatNumber?: string;
  contactPerson: string;
  email: string;
  phone?: string;
  role: string;
  wpResponsibilities: string[];
}

const sampleParticipants: Participant[] = [
  {
    id: 'p1',
    name: 'European Research Institute',
    shortName: 'ERI',
    type: 'beneficiary',
    country: 'Germany',
    pic: '999876543',
    vatNumber: 'DE123456789',
    contactPerson: 'Dr. Elena Martínez',
    email: 'e.martinez@eri.eu',
    phone: '+49 89 1234567',
    role: 'Coordinator',
    wpResponsibilities: ['WP1', 'WP3'],
  },
  {
    id: 'p2',
    name: 'Technical University of Munich',
    shortName: 'TUM',
    type: 'beneficiary',
    country: 'Germany',
    pic: '999111222',
    vatNumber: 'DE987654321',
    contactPerson: 'Prof. Hans Weber',
    email: 'h.weber@tum.de',
    phone: '+49 89 7654321',
    role: 'Technical Lead',
    wpResponsibilities: ['WP2', 'WP4'],
  },
  {
    id: 'p3',
    name: 'Centre National de la Recherche Scientifique',
    shortName: 'CNRS',
    type: 'beneficiary',
    country: 'France',
    pic: '999333444',
    contactPerson: 'Dr. Sophie Laurent',
    email: 's.laurent@cnrs.fr',
    role: 'Research Partner',
    wpResponsibilities: ['WP2', 'WP5'],
  },
  {
    id: 'p4',
    name: 'University of Oxford',
    shortName: 'OXFORD',
    type: 'beneficiary',
    country: 'United Kingdom',
    pic: '999555666',
    contactPerson: 'Prof. James Wilson',
    email: 'j.wilson@oxford.ac.uk',
    role: 'Validation Lead',
    wpResponsibilities: ['WP3', 'WP5'],
  },
  {
    id: 'p5',
    name: 'Politecnico di Milano',
    shortName: 'POLIMI',
    type: 'beneficiary',
    country: 'Italy',
    pic: '999777888',
    contactPerson: 'Prof. Marco Rossi',
    email: 'm.rossi@polimi.it',
    role: 'Innovation Partner',
    wpResponsibilities: ['WP4', 'WP6'],
  },
];

export default function Consortium() {
  const [participants] = useState<Participant[]>(sampleParticipants);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.shortName.toLowerCase().includes(search.toLowerCase()) ||
    p.country.toLowerCase().includes(search.toLowerCase())
  );

  const countries = [...new Set(participants.map(p => p.country))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Consortium</h1>
          <p className="text-slate-500 mt-1">Manage project participants and their roles</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          Add Participant
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{participants.length}</p>
              <p className="text-xs text-slate-500">Total Participants</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Globe size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{countries.length}</p>
              <p className="text-xs text-slate-500">Countries</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{participants.filter(p => p.type === 'beneficiary').length}</p>
              <p className="text-xs text-slate-500">Beneficiaries</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{participants.filter(p => p.pic).length}</p>
              <p className="text-xs text-slate-500">With PIC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search participants..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Organization</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Country</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">PIC</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">WPs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-xs font-bold text-primary-700">
                        {p.shortName.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{p.shortName}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{p.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-slate-600">{p.country}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                      {p.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-mono text-slate-600">{p.pic || '—'}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-slate-600">{p.role}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Mail size={10} />
                      {p.email}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {p.wpResponsibilities.map(wp => (
                        <span key={wp} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                          {wp}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Participant Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add Participant</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Legal Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Short Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option>Beneficiary</option>
                    <option>Affiliated Entity</option>
                    <option>Associated Partner</option>
                    <option>Third Party</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="e.g., Germany" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">PIC Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="999XXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">VAT Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person *</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input type="email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role in Project</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" placeholder="e.g., Technical Lead" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">Add Participant</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

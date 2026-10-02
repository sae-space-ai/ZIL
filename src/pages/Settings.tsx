import { Settings as SettingsIcon, User, Building2, Bell, Shield, Palette, Database, Key } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input type="text" defaultValue="Dr. Elena Martínez" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" defaultValue="admin@eugrant.eu" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                      <input type="text" defaultValue="Administrator" disabled className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                      <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                        <option>Europe/Berlin (CET/CEST)</option>
                        <option>Europe/Paris (CET/CEST)</option>
                        <option>Europe/London (GMT/BST)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'organization' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-slate-800 mb-4">Organization Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Legal Name</label>
                    <input type="text" defaultValue="European Research Institute" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Short Name</label>
                    <input type="text" defaultValue="ERI" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">PIC Number</label>
                    <input type="text" defaultValue="999876543" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">VAT Number</label>
                    <input type="text" defaultValue="DE123456789" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                    <input type="text" defaultValue="Germany" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Entity Type</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                      <option>Research Organisation</option>
                      <option>University</option>
                      <option>Private Company</option>
                      <option>Public Body</option>
                      <option>NGO / International Organisation</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 mb-4">Notification Preferences</h3>
                {[
                  { label: 'Call deadline reminders', description: 'Get notified 30, 14, and 7 days before deadlines', enabled: true },
                  { label: 'Compliance alerts', description: 'Alert when validation issues are detected', enabled: true },
                  { label: 'Team activity updates', description: 'Notifications when team members edit documents', enabled: true },
                  { label: 'Budget change alerts', description: 'Notify when budget exceeds thresholds', enabled: false },
                  { label: 'Weekly summary', description: 'Receive weekly progress report via email', enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-primary-500' : 'bg-slate-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${item.enabled ? 'left-5.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-slate-800 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-1">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500 mb-3">Add an extra layer of security to your account</p>
                    <button className="px-3 py-1.5 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50">
                      Enable 2FA
                    </button>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-1">Change Password</p>
                    <p className="text-xs text-slate-500 mb-3">Last changed 30 days ago</p>
                    <button className="px-3 py-1.5 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50">
                      Update Password
                    </button>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-1">Active Sessions</p>
                    <p className="text-xs text-slate-500">2 active sessions on 2 devices</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 mb-4">Database & Integrations</h3>
                <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Database size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Supabase (PostgreSQL)</p>
                      <p className="text-xs text-slate-500">Connected • eu-west-1</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Connected</span>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Supabase Storage</p>
                      <p className="text-xs text-slate-500">File storage for documents</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Connected</span>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <SettingsIcon size={18} className="text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Qwen AI API</p>
                      <p className="text-xs text-slate-500">AI-powered document generation</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Configure</span>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 mb-4">API Keys</h3>
                <div className="p-4 border border-slate-200 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-1">Qwen API Key</p>
                  <p className="text-xs text-slate-500 mb-3">Used for AI-powered content generation</p>
                  <div className="flex gap-2">
                    <input type="password" value="sk-xxxxxxxxxxxxxxxxxxxx" readOnly className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono" />
                    <button className="px-3 py-2 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50">
                      Reveal
                    </button>
                  </div>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                  <p className="text-sm font-medium text-slate-700 mb-1">Supabase Anon Key</p>
                  <p className="text-xs text-slate-500 mb-3">Public key for client-side operations</p>
                  <div className="flex gap-2">
                    <input type="password" value="eyJhbGciOiJIUzI1NiIsInR5..." readOnly className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 font-mono" />
                    <button className="px-3 py-2 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50">
                      Reveal
                    </button>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                  Generate New Key
                </button>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 mb-4">Appearance</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Light', active: true },
                    { label: 'Dark', active: false },
                    { label: 'System', active: false },
                  ].map((theme) => (
                    <button
                      key={theme.label}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        theme.active ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded mb-2 ${theme.label === 'Dark' ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}></div>
                      <span className="text-sm font-medium text-slate-700">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

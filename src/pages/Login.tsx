import { useState } from 'react';
import { login, register, User } from '../lib/auth';
import { GraduationCap, Mail, Lock, User as UserIcon, Building2, ArrowRight, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !organization) {
          setError('All fields are required');
          setLoading(false);
          return;
        }
        const user = await register(name, email, organization);
        onLogin(user);
      } else {
        const user = await login(email, password);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-eu-blue via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-eu-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-eu-gold rounded-xl flex items-center justify-center">
              <GraduationCap size={28} className="text-eu-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EU Grant</h1>
              <p className="text-sm text-primary-200">Submission Engine</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Prepare winning proposals for European funding
          </h2>
          <p className="text-lg text-primary-200 mb-8 max-w-md">
            Intelligent platform for preparing, validating, and submitting EU grant applications. 
            From Horizon Europe to ERC, streamline your entire submission workflow.
          </p>
          <div className="space-y-4">
            {['AI-powered call analysis', 'Automated Part A & B generation', 'Budget engine with validation', 'Compliance checking'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-eu-gold/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-eu-gold"></div>
                </div>
                <span className="text-primary-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-eu-gold rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-eu-blue" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">EU Grant Submission Engine</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 mb-8">
            {isRegister 
              ? 'Register to start preparing your EU grant proposals' 
              : 'Sign in to access your projects and proposals'}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="University of Example"
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="admin@eugrant.eu"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs font-medium text-blue-800 mb-2">Demo Accounts (any password):</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>• admin@eugrant.eu (Administrator)</p>
                <p>• coordinator@eugrant.eu (Coordinator)</p>
                <p>• member@eugrant.eu (Member)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

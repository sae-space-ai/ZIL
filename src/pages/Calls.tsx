import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Calendar,
  Euro,
  Tag,
  AlertCircle,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  ChevronDown,
  ArrowUpRight,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  searchOpportunities,
  Opportunity,
  SearchParams,
  STATUS_CODES,
  TYPE_CODES,
  PROGRAMME_CODES,
  getStatusName,
  getTypeName,
  getProgrammeName,
} from '../lib/euFundingApi';

export default function Calls() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'fallback' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([STATUS_CODES.OPEN]);
  const [selectedType, setSelectedType] = useState<string[]>([TYPE_CODES.CALL_FOR_PROPOSALS]);
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [limit, setLimit] = useState(20);

  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: SearchParams = {
      text: searchText || undefined,
      status: selectedStatus,
      type: selectedType,
      programme: selectedProgramme || undefined,
      limit,
      language: 'en',
      sort: 'deadline:asc',
    };

    const result = await searchOpportunities(params);

    setDataSource(result.source);
    setOpportunities(result.opportunities);
    setTotal(result.total);
    setLastUpdated(new Date());

    if (result.source === 'api') {
      setConnected(true);
      setError(null);
    } else {
      setConnected(false);
      setError(result.error || null);
    }

    setLoading(false);
  }, [searchText, selectedStatus, selectedType, selectedProgramme, limit]);

  // Initial search on mount
  useEffect(() => {
    performSearch();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const toggleStatus = (code: string) => {
    setSelectedStatus(prev =>
      prev.includes(code) ? prev.filter(s => s !== code) : [...prev, code]
    );
  };

  const toggleType = (code: string) => {
    setSelectedType(prev =>
      prev.includes(code) ? prev.filter(s => s !== code) : [...prev, code]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case STATUS_CODES.OPEN:
        return { style: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Open' };
      case STATUS_CODES.FORTHCOMING:
        return { style: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Forthcoming' };
      case STATUS_CODES.CLOSED:
        return { style: 'bg-slate-100 text-slate-500 border-slate-200', icon: AlertCircle, label: 'Closed' };
      default:
        return { style: 'bg-slate-100 text-slate-500 border-slate-200', icon: AlertCircle, label: getStatusName(status) };
    }
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return 'N/A';
    if (budget >= 1000000) return `€${(budget / 1000000).toFixed(1)}M`;
    if (budget >= 1000) return `€${(budget / 1000).toFixed(0)}K`;
    return `€${budget.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const isDeadlineSoon = (dateStr: string) => {
    if (!dateStr) return false;
    try {
      const deadline = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 30;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Open Calls Search</h1>
          <p className="text-slate-500 mt-1">
            Live search from the{' '}
            <a
              href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              EU Funding & Tenders Portal
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            connected === null ? 'bg-slate-50 text-slate-500 border-slate-200' :
            connected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {connected === null ? (
              <Loader2 size={12} className="animate-spin" />
            ) : connected ? (
              <Wifi size={12} />
            ) : (
              <WifiOff size={12} />
            )}
            {connected === null ? 'Connecting...' : connected ? 'Live API' : 'Cached Data'}
          </div>
          <button
            onClick={performSearch}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        {/* Text Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by keyword, call identifier, or topic..."
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: STATUS_CODES.OPEN, label: 'Open' },
                { code: STATUS_CODES.FORTHCOMING, label: 'Forthcoming' },
                { code: STATUS_CODES.CLOSED, label: 'Closed' },
              ].map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => toggleStatus(s.code)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    selectedStatus.includes(s.code)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: TYPE_CODES.CALL_FOR_PROPOSALS, label: 'Proposals' },
                { code: TYPE_CODES.CALL_FOR_TENDERS, label: 'Tenders' },
                { code: TYPE_CODES.CALL_FOR_EXPRESSION_OF_INTEREST, label: 'EOI' },
                { code: TYPE_CODES.PRIZE, label: 'Prizes' },
              ].map((t) => (
                <button
                  key={t.code}
                  type="button"
                  onClick={() => toggleType(t.code)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    selectedType.includes(t.code)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Programme Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-2">Programme</label>
            <select
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="">All Programmes</option>
              {Object.entries(PROGRAMME_CODES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <label className="text-xs text-slate-500">Results per page:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-2 py-1 border border-slate-200 rounded text-xs"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Search size={14} />
            {loading ? 'Searching...' : 'Search Calls'}
          </button>
        </div>
      </form>

      {/* Results Summary */}
      {connected && !loading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-800">{opportunities.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{total.toLocaleString()}</span> results
            {lastUpdated && (
              <span className="text-slate-400 ml-2">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
          <a
            href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View on EU Portal <ExternalLink size={10} />
          </a>
        </div>
      )}

      {/* Data Source Info */}
      {error && dataSource === 'fallback' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800">Showing Curated EU Calls</h3>
              <p className="text-sm text-amber-700 mt-1">
                The live API is not reachable from this browser (CORS restriction). Showing verified open calls from the EU Funding & Tenders Portal.
              </p>
              <p className="text-xs text-amber-600 mt-2">
                These calls are sourced from the official portal. For the complete real-time listing, visit{' '}
                <a
                  href="https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/calls-for-proposals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  ec.europa.eu/info/funding-tenders
                </a>
                . When deployed with a backend proxy, the live API will be fully accessible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Fetching opportunities from EU Funding & Tenders Portal...</p>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && opportunities.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {opportunities.map((opp) => {
            const badge = getStatusBadge(opp.status);
            const StatusIcon = badge.icon;
            const soon = isDeadlineSoon(opp.deadline);

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-primary-200 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 border ${badge.style}`}>
                      <StatusIcon size={10} />
                      {badge.label}
                    </span>
                    {opp.type && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-100 text-violet-700 border border-violet-200">
                        {getTypeName(opp.type)}
                      </span>
                    )}
                  </div>
                  {soon && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 border border-red-200 animate-pulse">
                      Deadline Soon
                    </span>
                  )}
                </div>

                {/* Title & ID */}
                <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
                  {opp.title}
                </h3>
                {opp.identifier && (
                  <p className="text-xs font-mono text-primary-600 mb-3">{opp.identifier}</p>
                )}

                {/* Programme */}
                {(opp.frameworkProgramme || opp.specificProgramme) && (
                  <div className="flex items-center gap-2 mb-3">
                    <Globe size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-600">
                      {getProgrammeName(opp.frameworkProgramme) || opp.frameworkProgramme}
                      {opp.specificProgramme && ` — ${opp.specificProgramme}`}
                    </span>
                  </div>
                )}

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Euro size={12} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400">Budget</p>
                      <p className="text-xs font-semibold text-slate-700">{formatBudget(opp.budget)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Calendar size={12} className={soon ? 'text-red-500' : 'text-slate-400'} />
                    <div>
                      <p className="text-[10px] text-slate-400">Deadline</p>
                      <p className={`text-xs font-semibold ${soon ? 'text-red-600' : 'text-slate-700'}`}>
                        {formatDate(opp.deadline)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                {opp.topics && opp.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {opp.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-mono">
                        {topic}
                      </span>
                    ))}
                    {opp.topics.length > 3 && (
                      <span className="px-2 py-0.5 text-slate-400 text-[10px]">
                        +{opp.topics.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    Opening: {formatDate(opp.openingDate)}
                  </span>
                  <a
                    href={opp.url || `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${opp.topicIdentifier || opp.callIdentifier || opp.identifier}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 group/link"
                  >
                    View Details
                    <ArrowUpRight size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && opportunities.length === 0 && connected && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Search size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500">No calls found matching your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* API Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Globe size={16} />
          EU Funding & Tenders Portal — Live API
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          This search is powered by the official European Commission REST API. Data is retrieved in real-time from the
          Funding & Tenders Portal (SEDIA).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Horizon Europe', code: '43108390' },
            { label: 'Digital Europe', code: '43108388' },
            { label: 'LIFE Programme', code: '43108389' },
            { label: 'Erasmus+', code: '43108391' },
          ].map((prog) => (
            <button
              key={prog.code}
              onClick={() => { setSelectedProgramme(prog.code); }}
              className="p-2 bg-white/60 rounded-lg text-xs text-blue-700 hover:bg-white hover:shadow-sm transition-all text-left"
            >
              <p className="font-medium">{prog.label}</p>
              <p className="text-blue-500 text-[10px]">Click to filter</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-blue-600 mt-3">
          API Endpoint: <code className="bg-blue-100 px-1 rounded">api.tech.ec.europa.eu/search-api/prod/rest/search</code>
        </p>
      </div>
    </div>
  );
}

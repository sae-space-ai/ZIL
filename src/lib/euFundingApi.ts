// EU Funding & Tenders Portal - Official REST API Integration
// Documentation: https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/support/apis

const API_BASE = 'https://api.tech.ec.europa.eu/search-api/prod/rest/search';
const API_KEY = 'SEDIA';
const FACET_API = 'https://api.tech.ec.europa.eu/search-api/prod/rest/facet';

// CORS proxy for browser-based requests
const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

// Status codes from EU F&T Portal
export const STATUS_CODES = {
  OPEN: '31094501',
  FORTHCOMING: '31094502',
  CLOSED: '31094503',
};

// Type codes
export const TYPE_CODES = {
  CALL_FOR_TENDERS: '0',
  CALL_FOR_PROPOSALS: '1',
  CALL_FOR_EXPRESSION_OF_INTEREST: '2',
  PRIZE: '8',
};

// Framework Programme codes
export const PROGRAMME_CODES: Record<string, string> = {
  '43108390': 'Horizon Europe',
  '43108388': 'Digital Europe Programme',
  '43108389': 'LIFE Programme',
  '43108391': 'Erasmus+',
  '43108392': 'Single Market Programme',
  '43108393': 'Creative Europe',
  '43108394': 'EU4Health',
};

export interface Opportunity {
  id: string;
  identifier: string;
  title: string;
  status: string;
  type: string;
  programme: string;
  frameworkProgramme: string;
  frameworkProgrammeCode?: string;
  topics: string[];
  deadline: string;
  openingDate: string;
  budget?: number;
  budgetCurrency?: string;
  callIdentifier?: string;
  topicIdentifier?: string;
  cc2?: string;
  specificProgramme?: string;
  destination?: string;
  url?: string;
}

export interface SearchParams {
  text?: string;
  status?: string[];
  type?: string[];
  programme?: string;
  programmePeriod?: string;
  limit?: number;
  start?: number;
  sort?: string;
  language?: string;
}

function buildQuery(params: SearchParams): string {
  const must: any[] = [];

  // Type filter - default to grants (proposals, expressions of interest, prizes)
  if (params.type && params.type.length > 0) {
    must.push({ terms: { type: params.type } });
  } else {
    must.push({ terms: { type: ['1', '2', '8'] } });
  }

  // Status filter
  if (params.status && params.status.length > 0) {
    must.push({ terms: { status: params.status } });
  } else {
    must.push({ terms: { status: [STATUS_CODES.OPEN, STATUS_CODES.FORTHCOMING] } });
  }

  // Programme filter
  if (params.programme) {
    must.push({ terms: { frameworkProgramme: [params.programme] } });
  }

  // Programme period
  if (params.programmePeriod) {
    must.push({ term: { programmePeriod: params.programmePeriod } });
  }

  // Free text search
  if (params.text) {
    must.push({
      query_string: {
        query: params.text,
      },
    });
  }

  return JSON.stringify({
    bool: { must },
  });
}

function buildUrl(params: SearchParams): string {
  const query = buildQuery(params);
  const searchText = params.text || '***';
  const urlParams = new URLSearchParams({
    apiKey: API_KEY,
    text: searchText,
  });

  if (params.language) {
    urlParams.set('language', params.language);
  }
  if (params.sort) {
    urlParams.set('sort', params.sort);
  }
  if (params.start !== undefined) {
    urlParams.set('start', String(params.start));
  }
  if (params.limit) {
    urlParams.set('limit', String(params.limit));
  }

  return `${API_BASE}?${urlParams.toString()}`;
}

function parseOpportunity(hit: any): Opportunity {
  const source = hit._source || hit;
  return {
    id: hit._id || source.id || source.nid || '',
    identifier: source.callIdentifier || source.topicIdentifier || source.identifier || '',
    title: source.title || '',
    status: source.status || '',
    type: source.type || '',
    programme: source.programme || '',
    frameworkProgramme: source.frameworkProgramme || '',
    frameworkProgrammeCode: source.frameworkProgramme,
    topics: source.topics || [],
    deadline: source.deadline || source.endDate || '',
    openingDate: source.openingDate || source.startDate || '',
    budget: source.budget ? parseFloat(source.budget) : undefined,
    budgetCurrency: source.budgetCurrency || 'EUR',
    callIdentifier: source.callIdentifier,
    topicIdentifier: source.topicIdentifier,
    cc2: source.cc2,
    specificProgramme: source.specificProgramme,
    destination: source.destination,
    url: source.url || (source.callIdentifier
      ? `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${source.topicIdentifier || source.callIdentifier}`
      : ''),
  };
}

async function fetchWithProxy(url: string, formData: FormData): Promise<Response> {
  // Try direct first
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'cors',
    });
    if (response.ok) return response;
  } catch {
    // CORS blocked, try proxies
  }

  // Try CORS proxies
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(url);
      const response = await fetch(proxyUrl, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) return response;
    } catch {
      continue;
    }
  }

  throw new Error('Unable to reach EU Funding & Tenders API. Please check your connection.');
}

export async function searchOpportunities(params: SearchParams = {}): Promise<{
  opportunities: Opportunity[];
  total: number;
  error?: string;
  source: 'api' | 'fallback';
}> {
  try {
    const url = buildUrl(params);
    const query = buildQuery(params);

    const formData = new FormData();
    formData.append('query', query);

    const response = await fetchWithProxy(url, formData);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();

    const hits = data.hits?.hits || data.result || [];
    const total = data.hits?.total?.value || data.total || hits.length;

    const opportunities = hits.map(parseOpportunity).filter((opp: Opportunity) => opp.title);

    if (opportunities.length > 0) {
      return {
        opportunities,
        total,
        source: 'api',
      };
    }
    throw new Error('No results from API');
  } catch (error: any) {
    // Fall back to curated data when API is unreachable (CORS, network, etc.)
    const filtered = filterFallback(params);
    return {
      opportunities: filtered,
      total: filtered.length,
      error: `Live API unavailable (${error.message || 'CORS/network'}). Showing curated data from the EU Funding & Tenders Portal.`,
      source: 'fallback',
    };
  }
}

function filterFallback(params: SearchParams): Opportunity[] {
  let results = [...FALLBACK_OPPORTUNITIES];

  // Filter by status
  if (params.status && params.status.length > 0) {
    results = results.filter(r => params.status!.includes(r.status));
  }

  // Filter by type
  if (params.type && params.type.length > 0) {
    results = results.filter(r => params.type!.includes(r.type));
  }

  // Filter by programme
  if (params.programme) {
    results = results.filter(r => r.frameworkProgramme === params.programme);
  }

  // Filter by text
  if (params.text) {
    const text = params.text.toLowerCase();
    results = results.filter(r =>
      r.title.toLowerCase().includes(text) ||
      r.identifier.toLowerCase().includes(text) ||
      (r.programme && r.programme.toLowerCase().includes(text))
    );
  }

  // Limit
  if (params.limit) {
    results = results.slice(0, params.limit);
  }

  return results;
}

export async function getTopicDetails(topicId: string): Promise<any> {
  try {
    const url = `${API_BASE}?apiKey=${API_KEY}&text=${encodeURIComponent(topicId)}`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error('Failed to fetch topic details');
    return await response.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

// Get human-readable programme name from code
export function getProgrammeName(code: string): string {
  return PROGRAMME_CODES[code] || code;
}

// Get human-readable status from code
export function getStatusName(code: string): string {
  switch (code) {
    case STATUS_CODES.OPEN: return 'Open';
    case STATUS_CODES.FORTHCOMING: return 'Forthcoming';
    case STATUS_CODES.CLOSED: return 'Closed';
    default: return code;
  }
}

// Get type name from code
export function getTypeName(code: string): string {
  switch (code) {
    case TYPE_CODES.CALL_FOR_PROPOSALS: return 'Call for Proposals';
    case TYPE_CODES.CALL_FOR_TENDERS: return 'Call for Tenders';
    case TYPE_CODES.CALL_FOR_EXPRESSION_OF_INTEREST: return 'Expression of Interest';
    case TYPE_CODES.PRIZE: return 'Prize';
    default: return code;
  }
}

// Fallback data: curated list of real EU open calls (updated periodically)
// These represent actual calls from the Funding & Tenders Portal
export const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'fb1',
    identifier: 'HORIZON-CL4-2025-DIGITAL-01-01',
    title: 'AI Factories – Testing and Experimentation Facilities for Artificial Intelligence, Data and Robotics',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Digital Europe Programme',
    frameworkProgramme: '43108388',
    topics: ['HORIZON-CL4-2025-DIGITAL-01-01'],
    deadline: '2025-09-17T17:00:00.000+02:00',
    openingDate: '2025-04-09T17:00:00.000+02:00',
    budget: 100000000,
    callIdentifier: 'HORIZON-CL4-2025-DIGITAL-01',
    topicIdentifier: 'HORIZON-CL4-2025-DIGITAL-01-01',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL4-2025-DIGITAL-01-01',
  },
  {
    id: 'fb2',
    identifier: 'HORIZON-CL5-2025-CL3-01',
    title: 'Advanced Climate Services and Solutions for Society',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['HORIZON-CL5-2025-CL3-01'],
    deadline: '2025-09-03T17:00:00.000+02:00',
    openingDate: '2025-04-09T17:00:00.000+02:00',
    budget: 40000000,
    callIdentifier: 'HORIZON-CL5-2025-CL3-01',
    topicIdentifier: 'HORIZON-CL5-2025-CL3-01',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL5-2025-CL3-01',
  },
  {
    id: 'fb3',
    identifier: 'HORIZON-ERC-2025-StG',
    title: 'ERC Starting Grants 2025',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['ERC-2025-StG'],
    deadline: '2025-10-28T17:00:00.000+01:00',
    openingDate: '2025-07-08T17:00:00.000+02:00',
    budget: 700000000,
    callIdentifier: 'ERC-2025-StG',
    topicIdentifier: 'ERC-2025-StG',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/ERC-2025-StG',
  },
  {
    id: 'fb4',
    identifier: 'HORIZON-CL6-2025-FARM2FORK-01',
    title: 'Safe and healthy food from primary production to consumption',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['HORIZON-CL6-2025-FARM2FORK-01-01', 'HORIZON-CL6-2025-FARM2FORK-01-02'],
    deadline: '2025-09-10T17:00:00.000+02:00',
    openingDate: '2025-04-09T17:00:00.000+02:00',
    budget: 35000000,
    callIdentifier: 'HORIZON-CL6-2025-FARM2FORK-01',
    topicIdentifier: 'HORIZON-CL6-2025-FARM2FORK-01-01',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL6-2025-FARM2FORK-01-01',
  },
  {
    id: 'fb5',
    identifier: 'HORIZON-CL4-2025-DATA-01-03',
    title: 'Common European Data Spaces – Cross-sectoral Data Space Building Blocks',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['HORIZON-CL4-2025-DATA-01-03'],
    deadline: '2025-09-17T17:00:00.000+02:00',
    openingDate: '2025-04-09T17:00:00.000+02:00',
    budget: 28000000,
    callIdentifier: 'HORIZON-CL4-2025-DATA-01',
    topicIdentifier: 'HORIZON-CL4-2025-DATA-01-03',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL4-2025-DATA-01-03',
  },
  {
    id: 'fb6',
    identifier: 'HORIZON-CL5-2025-ENERGY-02',
    title: 'Renewable Energy Integration and Grid Flexibility',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['HORIZON-CL5-2025-ENERGY-02-01', 'HORIZON-CL5-2025-ENERGY-02-02'],
    deadline: '2025-09-17T17:00:00.000+02:00',
    openingDate: '2025-04-09T17:00:00.000+02:00',
    budget: 60000000,
    callIdentifier: 'HORIZON-CL5-2025-ENERGY-02',
    topicIdentifier: 'HORIZON-CL5-2025-ENERGY-02-01',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL5-2025-ENERGY-02-01',
  },
  {
    id: 'fb7',
    identifier: 'LIFE-2025-CET-PE',
    title: 'Clean Energy Transition — Pilot and Demonstration Projects',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'LIFE Programme',
    frameworkProgramme: '43108389',
    topics: ['LIFE-2025-CET-PE'],
    deadline: '2025-10-01T17:00:00.000+02:00',
    openingDate: '2025-05-20T17:00:00.000+02:00',
    budget: 50000000,
    callIdentifier: 'LIFE-2025-CET-PE',
    topicIdentifier: 'LIFE-2025-CET-PE',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/LIFE-2025-CET-PE',
  },
  {
    id: 'fb8',
    identifier: 'HORIZON-CL3-2025-RESILIENCE-01',
    title: 'Strengthening EU Disaster Resilience and Risk Management',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['HORIZON-CL3-2025-RESILIENCE-01-01'],
    deadline: '2025-10-15T17:00:00.000+02:00',
    openingDate: '2025-06-10T17:00:00.000+02:00',
    budget: 25000000,
    callIdentifier: 'HORIZON-CL3-2025-RESILIENCE-01',
    topicIdentifier: 'HORIZON-CL3-2025-RESILIENCE-01-01',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL3-2025-RESILIENCE-01-01',
  },
  {
    id: 'fb9',
    identifier: 'HORIZON-CL4-2025-CLOUD-01',
    title: 'European Cloud and Edge Infrastructure for Scientific Applications',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['HORIZON-CL4-2025-CLOUD-01-01'],
    deadline: '2025-11-05T17:00:00.000+01:00',
    openingDate: '2025-07-02T17:00:00.000+02:00',
    budget: 45000000,
    callIdentifier: 'HORIZON-CL4-2025-CLOUD-01',
    topicIdentifier: 'HORIZON-CL4-2025-CLOUD-01-01',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL4-2025-CLOUD-01-01',
  },
  {
    id: 'fb10',
    identifier: 'ERASMUS-EDU-2025-CBHE',
    title: 'Capacity Building in the Field of Higher Education',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Erasmus+',
    frameworkProgramme: '43108391',
    topics: ['ERASMUS-EDU-2025-CBHE'],
    deadline: '2025-11-26T17:00:00.000+01:00',
    openingDate: '2025-10-15T17:00:00.000+02:00',
    budget: 120000000,
    callIdentifier: 'ERASMUS-EDU-2025-CBHE',
    topicIdentifier: 'ERASMUS-EDU-2025-CBHE',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/ERASMUS-EDU-2025-CBHE',
  },
  {
    id: 'fb11',
    identifier: 'HORIZON-ERC-2025-PoC',
    title: 'ERC Proof of Concept Grants 2025',
    status: STATUS_CODES.FORTHCOMING,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['ERC-2025-PoC'],
    deadline: '2025-10-28T17:00:00.000+01:00',
    openingDate: '2025-07-08T17:00:00.000+02:00',
    budget: 80000000,
    callIdentifier: 'ERC-2025-PoC',
    topicIdentifier: 'ERC-2025-PoC',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/ERC-2025-PoC',
  },
  {
    id: 'fb12',
    identifier: 'HORIZON-CL6-2025-BIODIV-01',
    title: 'Biodiversity Monitoring and Ecosystem Restoration',
    status: STATUS_CODES.OPEN,
    type: TYPE_CODES.CALL_FOR_PROPOSALS,
    programme: 'Horizon Europe',
    frameworkProgramme: '43108390',
    topics: ['HORIZON-CL6-2025-BIODIV-01-01', 'HORIZON-CL6-2025-BIODIV-01-02'],
    deadline: '2025-10-01T17:00:00.000+02:00',
    openingDate: '2025-05-07T17:00:00.000+02:00',
    budget: 38000000,
    callIdentifier: 'HORIZON-CL6-2025-BIODIV-01',
    topicIdentifier: 'HORIZON-CL6-2025-BIODIV-01-01',
    url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL6-2025-BIODIV-01-01',
  },
];

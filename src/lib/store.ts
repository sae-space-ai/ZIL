// EU Grant Submission Engine - Global State Store
import { User } from './auth';

export interface Project {
  id: string;
  title: string;
  acronym: string;
  summary: string;
  objectives: string[];
  duration: number; // months
  programme: string;
  callId: string;
  estimatedBudget: number;
  coordinator: string;
  status: 'draft' | 'in_progress' | 'review' | 'submitted' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AppState {
  user: User | null;
  projects: Project[];
  currentProjectId: string | null;
  sidebarCollapsed: boolean;
}

const STATE_KEY = 'eu_grant_state';

export function loadState(): AppState {
  const stored = localStorage.getItem(STATE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    user: null,
    projects: [],
    currentProjectId: null,
    sidebarCollapsed: false,
  };
}

export function saveState(state: AppState): void {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function getProjects(): Project[] {
  const state = loadState();
  return state.projects;
}

export function getProject(id: string): Project | undefined {
  const state = loadState();
  return state.projects.find(p => p.id === id);
}

export function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const state = loadState();
  const newProject: Project = {
    ...project,
    id: `prj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.projects.push(newProject);
  saveState(state);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const state = loadState();
  const index = state.projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  state.projects[index] = { ...state.projects[index], ...updates, updatedAt: new Date().toISOString() };
  saveState(state);
  return state.projects[index];
}

export function deleteProject(id: string): boolean {
  const state = loadState();
  const filtered = state.projects.filter(p => p.id !== id);
  if (filtered.length === state.projects.length) return false;
  state.projects = filtered;
  saveState(state);
  return true;
}

export function archiveProject(id: string): Project | null {
  return updateProject(id, { status: 'archived' });
}

export function setCurrentProject(id: string | null): void {
  const state = loadState();
  state.currentProjectId = id;
  saveState(state);
}

export function toggleSidebar(): void {
  const state = loadState();
  state.sidebarCollapsed = !state.sidebarCollapsed;
  saveState(state);
}

// Sample data for demo
export function initializeSampleData(userId: string): void {
  const state = loadState();
  if (state.projects.length > 0) return;

  const sampleProjects: Project[] = [
    {
      id: 'prj_sample_001',
      title: 'Advanced Quantum Computing for Climate Modelling',
      acronym: 'QUANTUM-CLIM',
      summary: 'Development of quantum algorithms for high-resolution climate simulations enabling breakthrough predictions of extreme weather events and long-term climate patterns.',
      objectives: [
        'Develop quantum-enhanced algorithms for atmospheric modelling',
        'Create hybrid classical-quantum climate simulation framework',
        'Validate predictions against historical climate data',
        'Establish open-source toolkit for climate research community',
      ],
      duration: 48,
      programme: 'Horizon Europe',
      callId: 'HORIZON-CL5-2024-CL3-01',
      estimatedBudget: 8500000,
      coordinator: 'European Research Institute',
      status: 'in_progress',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-12-01T14:30:00Z',
      createdBy: userId,
    },
    {
      id: 'prj_sample_002',
      title: 'Sustainable Urban Mobility through AI-driven Logistics',
      acronym: 'AI-MOBILITY',
      summary: 'Integration of artificial intelligence systems for optimizing last-mile delivery in European cities, reducing emissions by 40% while maintaining service quality.',
      objectives: [
        'Design AI routing algorithms for urban delivery networks',
        'Implement pilot in 3 European cities',
        'Measure emission reductions and efficiency gains',
        'Create policy recommendations for smart city integration',
      ],
      duration: 36,
      programme: 'Horizon Europe',
      callId: 'HORIZON-CL4-2024-DIGITAL-01',
      estimatedBudget: 6200000,
      coordinator: 'Technical University of Munich',
      status: 'draft',
      createdAt: '2024-06-20T09:00:00Z',
      updatedAt: '2024-11-28T16:45:00Z',
      createdBy: userId,
    },
    {
      id: 'prj_sample_003',
      title: 'Next-Generation Biodegradable Electronics',
      acronym: 'BIOELECTRON',
      summary: 'Research and development of fully biodegradable electronic components for medical implants and environmental sensors, eliminating electronic waste at end-of-life.',
      objectives: [
        'Synthesize biocompatible semiconductor materials',
        'Design transient electronic circuits',
        'Test in vivo biodegradation rates',
        'Develop manufacturing protocols for scale-up',
      ],
      duration: 42,
      programme: 'Horizon Europe',
      callId: 'HORIZON-ERC-2024-SYG',
      estimatedBudget: 4800000,
      coordinator: 'CNRS France',
      status: 'review',
      createdAt: '2024-09-01T11:00:00Z',
      updatedAt: '2024-12-10T08:20:00Z',
      createdBy: userId,
    },
  ];

  state.projects = sampleProjects;
  saveState(state);
}

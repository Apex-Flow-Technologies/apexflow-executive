import { create } from 'zustand';

export type DealStage = 'Talking' | 'Demo' | 'Confirmation' | 'After Demo';

export interface Client {
  id: string;
  name: string;
  contactInfo: string;
  leadQuality: 'Hot' | 'Warm' | 'Cold';
  projectName: string;
  notes: string;
  dealStage: DealStage;
  monthlyRetainer: number;
  lumpSum: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  clientId?: string;
}

export interface ExpenseItem {
  id: string;
  type: 'Expense' | 'Drawing';
  source: string;
  amount: number;
  date: string;
}

export interface Transcript {
  id: string;
  text: string;
  actionTaken: string;
  timestamp: string;
}

interface AppState {
  clients: Client[];
  expenses: ExpenseItem[];
  meetings: Meeting[];
  transcripts: Transcript[];
  
  // Actions
  addClient: (client: Client) => void;
  updateClientStage: (id: string, stage: DealStage) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addExpense: (expense: ExpenseItem) => void;
  addMeeting: (meeting: Meeting) => void;
  addTranscript: (transcript: Transcript) => void;
  setMockData: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  clients: [],
  expenses: [],
  meetings: [],
  transcripts: [],

  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  
  updateClientStage: (id, stage) => set((state) => ({
    clients: state.clients.map((c) => c.id === id ? { ...c, dealStage: stage } : c)
  })),

  updateClient: (id, updates) => set((state) => ({
    clients: state.clients.map((c) => c.id === id ? { ...c, ...updates } : c)
  })),

  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, expense]
  })),

  addMeeting: (meeting) => set((state) => ({
    meetings: [...state.meetings, meeting]
  })),
  
  addTranscript: (transcript) => set((state) => ({
    transcripts: [transcript, ...state.transcripts]
  })),

  setMockData: () => set({
    expenses: [
      { id: 'e1', type: 'Expense', source: 'Software Licenses', amount: 1200, date: '2026-07-25' },
      { id: 'e2', type: 'Expense', source: 'Marketing Ads', amount: 3300, date: '2026-07-26' },
      { id: 'd1', type: 'Drawing', source: 'Executive Salary', amount: 8000, date: '2026-07-27' }
    ],
    clients: [
      {
        id: '1',
        name: 'Acme Corp',
        contactInfo: 'john@acme.com',
        leadQuality: 'Hot',
        projectName: 'Enterprise Dashboard',
        notes: 'Needs demo next week',
        dealStage: 'Demo',
        monthlyRetainer: 5000,
        lumpSum: 0,
      },
      {
        id: '2',
        name: 'Stark Industries',
        contactInfo: 'tony@stark.com',
        leadQuality: 'Warm',
        projectName: 'AI Integration',
        notes: 'Discussing budget',
        dealStage: 'Talking',
        monthlyRetainer: 0,
        lumpSum: 25000,
      },
      {
        id: '3',
        name: 'Wayne Enterprises',
        contactInfo: 'bruce@wayne.com',
        leadQuality: 'Hot',
        projectName: 'Security Audit',
        notes: 'Contract sent',
        dealStage: 'Confirmation',
        monthlyRetainer: 10000,
        lumpSum: 5000,
      },
      {
        id: '4',
        name: 'Oscorp',
        contactInfo: 'norman@oscorp.com',
        leadQuality: 'Cold',
        projectName: 'Biotech UI',
        notes: 'Following up next month',
        dealStage: 'After Demo',
        monthlyRetainer: 0,
        lumpSum: 12000,
      }
    ],
    meetings: [
      {
        id: 'm1',
        title: 'Acme Corp Demo',
        date: '2026-07-28',
        time: '14:00',
        clientId: '1',
      }
    ],
    transcripts: []
  })
}));

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
  deleteClient: (id: string) => void;
  updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  deleteTranscript: (id: string) => void;
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

  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id),
    // Also cleanup meetings related to client
    meetings: state.meetings.filter((m) => m.clientId !== id)
  })),

  updateExpense: (id, updates) => set((state) => ({
    expenses: state.expenses.map((e) => e.id === id ? { ...e, ...updates } : e)
  })),

  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id)
  })),

  updateMeeting: (id, updates) => set((state) => ({
    meetings: state.meetings.map((m) => m.id === id ? { ...m, ...updates } : m)
  })),

  deleteMeeting: (id) => set((state) => ({
    meetings: state.meetings.filter((m) => m.id !== id)
  })),

  deleteTranscript: (id) => set((state) => ({
    transcripts: state.transcripts.filter((t) => t.id !== id)
  })),

  setMockData: () => set({
    expenses: [],
    clients: [],
    meetings: [],
    transcripts: []
  })
}));

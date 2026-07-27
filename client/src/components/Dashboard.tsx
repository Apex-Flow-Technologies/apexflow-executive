import React, { useState } from 'react';
import ParticleBackground from './ParticleBackground';
import MetricCards from './MetricCards';
import KanbanBoard from './KanbanBoard';
import ClientList from './ClientList';
import CalendarView from './CalendarView';
import VoiceRecorder from './VoiceRecorder';
import AddClientModal from './AddClientModal';
import AddExpenseModal from './AddExpenseModal';
import { LayoutDashboard, List, Calendar as CalendarIcon, Plus, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <div className="min-h-screen p-6 font-sans overflow-x-hidden">
      <ParticleBackground />
      
      <div className="max-w-[1600px] mx-auto z-10 relative h-full flex flex-col">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-end border-b border-royal-deep/30 pb-4 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              ApexFlow <span className="text-cyan-wave">Executive</span>
            </h1>
            <p className="text-gray-400 mt-2">AI-Powered Deal Pipeline & Financials</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddExpense(true)}
                className="flex items-center gap-2 px-3 py-2 bg-navy-800 border border-royal-deep hover:bg-navy-700 text-white font-semibold rounded-lg transition-all"
              >
                <DollarSign size={16} className="text-red-400" /> Expense
              </button>
              <button 
                onClick={() => setShowAddClient(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-wave hover:bg-cyan-wave/80 text-white font-semibold rounded-lg shadow-lg shadow-cyan-wave/20 transition-all"
              >
                <Plus size={18} /> New Client
              </button>
            </div>
            
            <div className="flex bg-navy-800/80 rounded-lg p-1 border border-royal-deep/30 backdrop-blur-md">
              <button 
                onClick={() => setView('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${view === 'kanban' ? 'bg-cyan-wave/20 text-cyan-wave' : 'text-gray-400 hover:text-white'}`}
              >
                <LayoutDashboard size={18} /> Kanban
              </button>
              <button 
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${view === 'list' ? 'bg-cyan-wave/20 text-cyan-wave' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={18} /> Directory
              </button>
              <button 
                onClick={() => setView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${view === 'calendar' ? 'bg-cyan-wave/20 text-cyan-wave' : 'text-gray-400 hover:text-white'}`}
              >
                <CalendarIcon size={18} /> Meetings
              </button>
            </div>
          </div>
        </header>

        <MetricCards />

        <div className="flex-1 min-h-[500px]">
          {view === 'kanban' && <KanbanBoard />}
          {view === 'list' && <ClientList />}
          {view === 'calendar' && <CalendarView />}
        </div>
      </div>
      
      <VoiceRecorder />
      <AddClientModal isOpen={showAddClient} onClose={() => setShowAddClient(false)} />
      <AddExpenseModal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} />
    </div>
  );
};

export default Dashboard;

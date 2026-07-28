import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/store';
import MetricBreakdownModal from './MetricBreakdownModal';
import AddExpenseModal from './AddExpenseModal';

const MetricCards: React.FC = () => {
  const { clients, expenses, deleteExpense } = useAppStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);

  const businessExpenses = useMemo(() => expenses.filter(e => e.type === 'Expense').reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const personalDrawings = useMemo(() => expenses.filter(e => e.type === 'Drawing').reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const totalMonthlyRetainers = useMemo(() => clients.reduce((sum, c) => sum + c.monthlyRetainer, 0), [clients]);
  const totalLumpSum = useMemo(() => clients.reduce((sum, c) => sum + c.lumpSum, 0), [clients]);

  const netEarnings = (totalMonthlyRetainers + totalLumpSum) - (businessExpenses + personalDrawings);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getBreakdownData = (type: string) => {
    switch (type) {
      case 'Monthly Retainers':
        return clients.filter(c => c.monthlyRetainer > 0).map(c => ({ id: c.id, label: c.name, amount: c.monthlyRetainer, secondary: c.projectName }));
      case 'Lump-Sum Revenue':
        return clients.filter(c => c.lumpSum > 0).map(c => ({ id: c.id, label: c.name, amount: c.lumpSum, secondary: c.projectName }));
      case 'Business Expenses':
        return expenses.filter(e => e.type === 'Expense').map(e => ({ id: e.id, label: e.source, amount: e.amount, secondary: e.date }));
      case 'Personal Drawings':
        return expenses.filter(e => e.type === 'Drawing').map(e => ({ id: e.id, label: e.source, amount: e.amount, secondary: e.date }));
      default:
        return [];
    }
  };

  const Card = ({ title, amount, highlight = false }: { title: string, amount: number, highlight?: boolean }) => (
    <div 
      onClick={() => title !== 'Net Earnings' && setActiveModal(title)}
      className={`p-6 rounded-2xl border backdrop-blur-md bg-navy-800/80 transition-all ${title !== 'Net Earnings' ? 'cursor-pointer hover:bg-navy-800 hover:scale-[1.02]' : ''} ${highlight ? 'border-cyan-wave shadow-[0_0_15px_rgba(0,163,224,0.3)]' : 'border-royal-deep/30 hover:border-cyan-wave/50'}`}
    >
      <h3 className="text-gray-400 text-sm uppercase font-semibold tracking-wider mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${highlight ? 'text-cyan-wave' : 'text-white'}`}>{formatCurrency(amount)}</p>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card title="Monthly Retainers" amount={totalMonthlyRetainers} />
        <Card title="Lump-Sum Revenue" amount={totalLumpSum} />
        <Card title="Business Expenses" amount={businessExpenses} />
        <Card title="Personal Drawings" amount={personalDrawings} />
        <Card title="Net Earnings" amount={netEarnings} highlight={true} />
      </div>

      <MetricBreakdownModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        title={activeModal || ''}
        data={activeModal ? getBreakdownData(activeModal) : []}
        onEdit={(id) => {
          if (activeModal === 'Business Expenses' || activeModal === 'Personal Drawings') {
            setEditExpenseId(id);
          }
        }}
        onDelete={(id) => {
          if (activeModal === 'Business Expenses' || activeModal === 'Personal Drawings') {
            if (window.confirm('Are you sure you want to delete this financial record?')) {
              deleteExpense(id);
            }
          }
        }}
      />

      <AddExpenseModal 
        isOpen={!!editExpenseId} 
        onClose={() => setEditExpenseId(null)} 
        expenseId={editExpenseId || undefined}
      />
    </>
  );
};

export default MetricCards;

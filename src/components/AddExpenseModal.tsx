import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAppStore } from '../store/store';
import type { ExpenseItem } from '../store/store';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId?: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, expenseId }) => {
  const addExpense = useAppStore(state => state.addExpense);
  const updateExpense = useAppStore(state => state.updateExpense);
  const expenses = useAppStore(state => state.expenses);

  const [formData, setFormData] = useState({
    type: 'Expense' as 'Expense' | 'Drawing',
    source: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  React.useEffect(() => {
    if (expenseId && isOpen) {
      const expense = expenses.find(e => e.id === expenseId);
      if (expense) {
        setFormData({
          type: expense.type,
          source: expense.source,
          amount: expense.amount,
          date: expense.date
        });
      }
    } else if (isOpen) {
      // Reset form when opened for a new record
      setFormData({
        type: 'Expense' as 'Expense' | 'Drawing',
        source: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [expenseId, isOpen, expenses]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseId) {
      updateExpense(expenseId, formData);
    } else {
      const newExpense: ExpenseItem = {
        id: Date.now().toString(),
        ...formData
      };
      addExpense(newExpense);
    }
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-navy-800 border border-royal-deep rounded-2xl w-full max-w-sm shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-royal-deep/30">
          <h2 className="text-xl font-bold text-white">{expenseId ? 'Edit' : 'Add'} Financial Record</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave">
              <option value="Expense">Business Expense</option>
              <option value="Drawing">Personal Drawing</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description / Source</label>
            <input required type="text" placeholder="e.g. Server Hosting" name="source" value={formData.source} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Amount (₹)</label>
            <input required type="number" min="0" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className={`w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 font-mono outline-none focus:border-cyan-wave ${formData.type === 'Expense' ? 'text-red-400' : 'text-orange-400'}`} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-wave hover:bg-cyan-wave/80 text-white font-semibold transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddExpenseModal;

import React from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';

interface MetricBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: { id?: string; label: string; amount: number; secondary?: string }[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const MetricBreakdownModal: React.FC<MetricBreakdownModalProps> = ({ isOpen, onClose, title, data, onEdit, onDelete }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-navy-800 border border-royal-deep rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-royal-deep/30">
          <h2 className="text-xl font-bold text-white">{title} Breakdown</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {data.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data available.</p>
          ) : (
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-navy-900/50 rounded-lg border border-royal-deep/20">
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.label}</p>
                    {item.secondary && <p className="text-xs text-gray-400">{item.secondary}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-cyan-wave font-bold">{formatCurrency(item.amount)}</p>
                    {item.id && onEdit && onDelete && (
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(item.id!)} className="text-gray-400 hover:text-cyan-wave transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(item.id!)} className="text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-royal-deep/30 bg-navy-900/30 flex justify-between items-center rounded-b-2xl">
          <span className="text-gray-400 uppercase text-sm font-semibold tracking-wider">Total</span>
          <span className="text-2xl font-bold text-white">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricBreakdownModal;

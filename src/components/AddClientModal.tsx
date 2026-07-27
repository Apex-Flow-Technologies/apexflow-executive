import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../store/store';
import type { Client, DealStage } from '../store/store';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const addClient = useAppStore(state => state.addClient);

  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    leadQuality: 'Warm' as 'Hot' | 'Warm' | 'Cold',
    projectName: '',
    notes: '',
    dealStage: 'Talking' as DealStage,
    monthlyRetainer: 0,
    lumpSum: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: Date.now().toString(),
      ...formData
    };
    addClient(newClient);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyRetainer' || name === 'lumpSum' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-navy-800 border border-royal-deep rounded-2xl w-full max-w-lg shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-royal-deep/30">
          <h2 className="text-xl font-bold text-white">Add New Client</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Client Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Info</label>
              <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
              <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Lead Quality</label>
              <select name="leadQuality" value={formData.leadQuality} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave">
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Initial Deal Stage</label>
              <select name="dealStage" value={formData.dealStage} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave">
                <option value="Talking">Talking</option>
                <option value="Demo">Demo</option>
                <option value="Confirmation">Confirmation</option>
                <option value="After Demo">After Demo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Monthly Retainer (₹)</label>
              <input type="number" min="0" name="monthlyRetainer" value={formData.monthlyRetainer} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-green-400 font-mono outline-none focus:border-cyan-wave" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Lump Sum (₹)</label>
              <input type="number" min="0" name="lumpSum" value={formData.lumpSum} onChange={handleChange} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-cyan-wave font-mono outline-none focus:border-cyan-wave" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave"></textarea>
          </div>

          <div className="pt-4 border-t border-royal-deep/30 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-wave hover:bg-cyan-wave/80 text-white font-semibold transition-colors">Save Client</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;

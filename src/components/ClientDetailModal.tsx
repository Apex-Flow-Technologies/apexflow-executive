import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAppStore } from '../store/store';
import type { Client } from '../store/store';

interface ClientDetailModalProps {
  clientId: string | null;
  onClose: () => void;
}

const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ clientId, onClose }) => {
  const clients = useAppStore(state => state.clients);
  const updateClient = useAppStore(state => state.updateClient);
  const deleteClient = useAppStore(state => state.deleteClient);
  
  const [formData, setFormData] = useState<Client | null>(null);

  useEffect(() => {
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) setFormData({ ...client });
    }
  }, [clientId, clients]);

  if (!clientId || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient(clientId, formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${formData.name}? This will also delete any associated meetings.`)) {
      deleteClient(clientId);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'monthlyRetainer' || name === 'lumpSum' ? Number(value) : value
      };
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-navy-800 border border-royal-deep rounded-2xl w-full max-w-lg shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-royal-deep/30">
          <h2 className="text-xl font-bold text-white">Client Details: {formData.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-1">Deal Stage</label>
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
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full bg-navy-900 border border-royal-deep/30 rounded-lg p-2 text-white outline-none focus:border-cyan-wave"></textarea>
          </div>

          <div className="pt-4 border-t border-royal-deep/30 flex justify-between items-center">
            <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors">
              Delete Client
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-wave hover:bg-cyan-wave/80 text-white font-semibold transition-colors">Save Changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ClientDetailModal;

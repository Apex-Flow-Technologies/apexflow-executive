import React, { useState } from 'react';
import { useAppStore } from '../store/store';
import ClientDetailModal from './ClientDetailModal';

const ClientList: React.FC = () => {
  const clients = useAppStore((state) => state.clients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const getLeadQualityColor = (quality: string) => {
    switch (quality) {
      case 'Hot': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Warm': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Cold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <div className="bg-navy-800/60 backdrop-blur-md border border-royal-deep/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-royal-deep/30 bg-navy-900/50">
              <th className="p-4 font-semibold text-gray-300">Client Name</th>
              <th className="p-4 font-semibold text-gray-300">Project</th>
              <th className="p-4 font-semibold text-gray-300">Stage</th>
              <th className="p-4 font-semibold text-gray-300">Lead</th>
              <th className="p-4 font-semibold text-gray-300">Retainer</th>
              <th className="p-4 font-semibold text-gray-300">Lump Sum</th>
              <th className="p-4 font-semibold text-gray-300">Notes</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} onClick={() => setSelectedClientId(client.id)} className="border-b border-royal-deep/10 hover:bg-royal-deep/5 transition-colors cursor-pointer group">
                <td className="p-4 font-medium text-white">{client.name}</td>
                <td className="p-4 text-gray-300">{client.projectName}</td>
                <td className="p-4">
                  <span className="text-sm bg-navy-900 border border-royal-deep/30 px-2 py-1 rounded-md text-gray-300">
                    {client.dealStage}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 border rounded-full ${getLeadQualityColor(client.leadQuality)}`}>
                    {client.leadQuality}
                  </span>
                </td>
                <td className="p-4 text-green-400 font-mono">
                  {client.monthlyRetainer > 0 ? `₹${client.monthlyRetainer}` : '-'}
                </td>
                <td className="p-4 text-cyan-wave font-mono">
                  {client.lumpSum > 0 ? `₹${client.lumpSum}` : '-'}
                </td>
                <td className="p-4 text-gray-400 text-sm max-w-xs truncate">{client.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ClientDetailModal clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />
    </>
  );
};

export default ClientList;

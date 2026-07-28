import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useAppStore } from '../store/store';
import type { DealStage } from '../store/store';
import { GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
import ClientDetailModal from './ClientDetailModal';

const STAGES: DealStage[] = ['Talking', 'Demo', 'Confirmation', 'After Demo'];

const KanbanBoard: React.FC = () => {
  const clients = useAppStore((state) => state.clients);
  const updateClientStage = useAppStore((state) => state.updateClientStage);
  const deleteClient = useAppStore((state) => state.deleteClient);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    updateClientStage(draggableId, destination.droppableId as DealStage);
  };

  const getLeadQualityColor = (quality: string) => {
    switch (quality) {
      case 'Hot': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'Warm': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Cold': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        {STAGES.map((stage) => {
          const stageClients = clients.filter(c => c.dealStage === stage);

          return (
            <div key={stage} className="flex-shrink-0 w-80 bg-navy-800/50 rounded-xl border border-royal-deep/20 flex flex-col backdrop-blur-sm h-full">
              <div className="p-4 border-b border-royal-deep/20">
                <h3 className="font-semibold text-lg text-white">{stage}</h3>
                <span className="text-xs text-gray-400">{stageClients.length} deals</span>
              </div>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-4 min-h-[300px] transition-colors ${snapshot.isDraggingOver ? 'bg-royal-deep/10' : ''}`}
                  >
                    {stageClients.map((client, index) => (
                      <Draggable key={client.id} draggableId={client.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`mb-3 bg-navy-900 border ${snapshot.isDragging ? 'border-cyan-wave shadow-lg shadow-cyan-wave/20' : 'border-royal-deep/30'} p-4 rounded-lg flex flex-col gap-2 relative`}
                          >
                            <div className="absolute top-4 right-2 flex gap-1 items-center">
                              <div className="text-gray-500 hover:text-white cursor-pointer p-1" onClick={(e) => { e.stopPropagation(); setSelectedClientId(client.id); }}>
                                <MoreHorizontal size={16} />
                              </div>
                              <div className="text-gray-500 hover:text-red-400 cursor-pointer p-1" onClick={(e) => { 
                                e.stopPropagation(); 
                                if (window.confirm(`Delete ${client.name}?`)) deleteClient(client.id); 
                              }}>
                                <Trash2 size={16} />
                              </div>
                            </div>
                            <div className="absolute top-4 right-16 text-gray-500 cursor-grab active:cursor-grabbing" {...provided.dragHandleProps}>
                              <GripVertical size={16} />
                            </div>
                            
                            <h4 className="font-bold text-white pr-12 cursor-pointer hover:text-cyan-wave" onClick={() => setSelectedClientId(client.id)}>{client.name}</h4>
                            <p className="text-sm text-gray-400 truncate">{client.projectName}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${getLeadQualityColor(client.leadQuality)}`}>
                                {client.leadQuality}
                              </span>
                              {client.monthlyRetainer > 0 && (
                                <span className="text-xs text-green-400 font-mono">₹{client.monthlyRetainer}/m</span>
                              )}
                              {client.lumpSum > 0 && (
                                <span className="text-xs text-cyan-wave font-mono">₹{client.lumpSum}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
      <ClientDetailModal clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />
    </DragDropContext>
  );
};

export default KanbanBoard;

import React, { useState } from 'react';
import { useAppStore } from '../store/store';
import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react';

const CalendarView: React.FC = () => {
  const { meetings, clients } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');

  // Simple calendar logic
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  
  const generateGoogleCalendarLink = (title: string, date: string, time: string) => {
    const startDate = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
    // Approximate 1 hour duration
    const endDate = `${date.replace(/-/g, '')}T${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}${time.split(':')[1]}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}`;
  };

  const handleDateClick = (day: number) => {
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDateStr(formattedDate);
    setShowScheduleModal(true);
  };

  return (
    <div className="bg-navy-800/60 backdrop-blur-md border border-royal-deep/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="text-cyan-wave" /> 
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} className="px-3 py-1 bg-navy-900 border border-royal-deep/30 rounded text-gray-300 hover:bg-royal-deep/20">&lt;</button>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} className="px-3 py-1 bg-navy-900 border border-royal-deep/30 rounded text-gray-300 hover:bg-royal-deep/20">&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-gray-400 text-sm mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const dayMeetings = meetings.filter(m => m.date === dateStr);
          
          return (
            <div 
              key={day} 
              onClick={() => handleDateClick(day)}
              className="min-h-[100px] bg-navy-900/50 border border-royal-deep/20 rounded-lg p-2 cursor-pointer hover:border-cyan-wave transition-all"
            >
              <span className="text-gray-300 font-semibold">{day}</span>
              <div className="mt-2 space-y-1">
                {dayMeetings.map(m => (
                  <div key={m.id} className="text-xs bg-cyan-wave/20 text-cyan-wave p-1 rounded truncate border border-cyan-wave/30 relative group">
                    {m.time} - {m.title}
                    
                    {/* Tooltip with GCal link */}
                    <div className="absolute hidden group-hover:flex z-50 left-0 bottom-full mb-1 w-48 bg-navy-900 border border-royal-deep p-2 rounded shadow-xl flex-col gap-2">
                      <span className="text-white whitespace-normal">{m.title}</span>
                      <a href={generateGoogleCalendarLink(m.title, m.date, m.time)} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-cyan-wave flex items-center gap-1 hover:underline">
                        <ExternalLink size={12} /> Add to GCal
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ScheduleModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} date={selectedDateStr} clients={clients} />
    </div>
  );
};

// Extracted inner modal to keep it simple
const ScheduleModal = ({ isOpen, onClose, date, clients }: any) => {
  const addMeeting = useAppStore(state => state.addMeeting);
  const [formData, setFormData] = useState({ title: '', time: '09:00', clientId: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.clientId && !formData.title) {
      const client = clients.find((c:any) => c.id === formData.clientId);
      formData.title = `Meeting with ${client?.name}`;
    }
    addMeeting({ id: Date.now().toString(), date, ...formData });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-navy-800 border border-royal-deep rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white mb-4">Schedule for {date}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Time</label>
            <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-navy-900 border border-royal-deep/30 rounded p-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Client (Optional)</label>
            <select value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full bg-navy-900 border border-royal-deep/30 rounded p-2 text-white">
              <option value="">None</option>
              {clients.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input type="text" placeholder={formData.clientId ? 'Auto-generated if empty' : 'Meeting Title'} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-navy-900 border border-royal-deep/30 rounded p-2 text-white" required={!formData.clientId} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-cyan-wave text-white rounded">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarView;

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader, History, ChevronDown, CheckCircle2, X } from 'lucide-react';
import { useAppStore } from '../store/store';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTray, setShowTray] = useState(false);
  
  const transcripts = useAppStore(state => state.transcripts);
  const deleteTranscript = useAppStore(state => state.deleteTranscript);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access is required to use this feature.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const apiUrl = import.meta.env.PROD ? '/api/process-audio' : 'http://localhost:3001/api/process-audio';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('Gemini Processed Data:', data);
      
      const store = useAppStore.getState();
      let actionTaken = 'No recognizable action found.';
      
      if (data.intent === 'schedule_meeting' && data.action) {
        store.addMeeting({
          id: Date.now().toString(),
          title: `Meeting with ${data.action.clientName}`,
          date: data.action.date,
          time: data.action.time
        });
        actionTaken = `Scheduled meeting with ${data.action.clientName} on ${data.action.date} at ${data.action.time}`;
        
        // Trigger browser notification
        if (Notification.permission === 'granted') {
          new Notification('Meeting Scheduled', { body: actionTaken });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') new Notification('Meeting Scheduled', { body: actionTaken });
          });
        }
      } else if (data.intent === 'update_stage' && data.action2) {
        const client = store.clients.find(c => c.name.toLowerCase().includes(data.action2.clientName.toLowerCase()));
        if (client) {
          store.updateClientStage(client.id, data.action2.newStage);
          actionTaken = `Updated ${client.name} to ${data.action2.newStage} stage`;
        }
      } else if (data.intent === 'update_financials' && data.action3) {
        if (data.action3.expenseAmount) {
          store.addExpense({
             id: Date.now().toString(),
             type: 'Expense',
             source: 'Voice Added Expense',
             amount: data.action3.expenseAmount,
             date: new Date().toISOString().split('T')[0]
          });
          actionTaken = `Added expense of ₹${data.action3.expenseAmount}`;
        }
      }

      store.addTranscript({
        id: Date.now().toString(),
        text: data.transcription || 'Audio transcribed, but no text returned.',
        actionTaken,
        timestamp: new Date().toLocaleTimeString()
      });
      
      setShowTray(true);

    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Transcript Tray */}
      {showTray && (
        <div className="w-80 bg-navy-800/90 backdrop-blur-md border border-royal-deep/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center p-3 border-b border-royal-deep/30 bg-navy-900/50">
            <h3 className="font-semibold text-white flex items-center gap-2"><History size={16} /> Voice History</h3>
            <button onClick={() => setShowTray(false)} className="text-gray-400 hover:text-white"><ChevronDown size={18} /></button>
          </div>
          <div className="max-h-60 overflow-y-auto p-3 space-y-3">
            {transcripts.length === 0 ? (
              <p className="text-xs text-gray-500 text-center">No transcripts yet.</p>
            ) : transcripts.map(t => (
              <div key={t.id} className="bg-navy-900 border border-royal-deep/20 rounded-lg p-3 text-sm relative group">
                <button 
                  onClick={() => deleteTranscript(t.id)} 
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
                <p className="text-gray-300 italic mb-2 pr-6">"{t.text}"</p>
                <div className="flex items-start gap-1 text-cyan-wave bg-cyan-wave/10 p-1.5 rounded text-xs border border-cyan-wave/20">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                  <span>{t.actionTaken}</span>
                </div>
                <div className="text-right text-[10px] text-gray-500 mt-1">{t.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        {transcripts.length > 0 && !showTray && (
          <button onClick={() => setShowTray(true)} className="bg-navy-800 border border-royal-deep text-cyan-wave p-2 rounded-full shadow-lg hover:bg-navy-900 transition-colors">
            <History size={20} />
          </button>
        )}
        
        {isProcessing ? (
          <button className="bg-navy-800 border border-royal-deep text-cyan-wave p-4 rounded-full shadow-lg cursor-not-allowed">
            <Loader className="animate-spin w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full shadow-2xl transition-all duration-300 ${
              isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110 shadow-red-500/50' 
              : 'bg-cyan-wave hover:bg-cyan-wave/80 hover:scale-105 shadow-cyan-wave/40'
            }`}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white fill-current" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
        )}
      </div>
      
      {isRecording && (
        <div className="absolute bottom-16 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap animate-bounce shadow-lg">
          Recording...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;

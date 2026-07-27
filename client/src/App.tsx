import { useEffect } from 'react';
import { useAppStore } from './store/store';
import Dashboard from './components/Dashboard';

function App() {
  const setMockData = useAppStore((state) => state.setMockData);
  const clients = useAppStore((state) => state.clients);

  useEffect(() => {
    if (clients.length === 0) {
      setMockData();
    }
  }, [clients.length, setMockData]);

  return (
    <div className="min-h-screen relative">
      <Dashboard />
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import { useAppStore } from './store/store';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen relative">
      <Dashboard />
    </div>
  );
}

export default App;

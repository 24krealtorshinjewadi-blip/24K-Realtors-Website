import React, { useState } from 'react';
import Portal from './components/Portal';
import Dashboard from './components/Dashboard';
import { Home, ShieldCheck, Building } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('portal'); // portal | dashboard

  return (
    <div className="app-wrapper">
      {/* Main Core View Area */}
      <main className="main-content">
        {currentView === 'portal' ? (
          <Portal onViewChange={setCurrentView} />
        ) : (
          <Dashboard onViewChange={setCurrentView} />
        )}
      </main>
    </div>
  );
}

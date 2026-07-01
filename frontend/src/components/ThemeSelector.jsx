import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeSelector() {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('crm-theme-mode') || 'dark');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light-theme');
    
    if (themeMode === 'light') {
      root.classList.add('light-theme');
    } else if (themeMode === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!systemPrefersDark) {
        root.classList.add('light-theme');
      }
    }
    localStorage.setItem('crm-theme-mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!isThemeMenuOpen) return;
    const closeMenu = () => setIsThemeMenuOpen(false);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isThemeMenuOpen]);

  return (
    <div className="nav-theme-dropdown-container">
      <button 
        className="nav-theme-circle-btn" 
        onClick={(e) => { e.stopPropagation(); setIsThemeMenuOpen(!isThemeMenuOpen); }}
        title="Toggle Theme Mode"
      >
        {themeMode === 'light' && <Sun size={13} />}
        {themeMode === 'dark' && <Moon size={13} />}
        {themeMode === 'system' && <Laptop size={13} />}
      </button>
      
      {isThemeMenuOpen && (
        <div className="theme-dropdown-menu">
          <button 
            className={`theme-menu-item ${themeMode === 'light' ? 'active' : ''}`}
            onClick={() => setThemeMode('light')}
          >
            <Sun size={12} />
            <span>Light Theme</span>
            {themeMode === 'light' && <span className="checkmark">✓</span>}
          </button>
          <button 
            className={`theme-menu-item ${themeMode === 'dark' ? 'active' : ''}`}
            onClick={() => setThemeMode('dark')}
          >
            <Moon size={12} />
            <span>Dark Theme</span>
            {themeMode === 'dark' && <span className="checkmark">✓</span>}
          </button>
          <button 
            className={`theme-menu-item ${themeMode === 'system' ? 'active' : ''}`}
            onClick={() => setThemeMode('system')}
          >
            <Laptop size={12} />
            <span>System Preference</span>
            {themeMode === 'system' && <span className="checkmark">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}

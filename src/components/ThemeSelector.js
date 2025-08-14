import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { currentTheme, themes, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeName) => {
    console.log('Theme changing from', currentTheme, 'to', themeName);
    changeTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative" ref={dropdownRef}>
        <button 
          className="px-4 py-2 bg-red-500 hover:bg-red-600 border border-white/20 rounded-lg text-white font-medium transition-all shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            backgroundColor: themes[currentTheme]?.colors?.primary || '#ef4444',
            borderColor: themes[currentTheme]?.colors?.border || '#ffffff'
          }}
        >
          🎨 {themes[currentTheme]?.name || 'Default'} Theme
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-black/80 backdrop-blur-xl border-2 border-white/40 rounded-lg shadow-2xl">
            <div className="p-2 space-y-1">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                    currentTheme === key
                      ? 'bg-white/30 text-white font-bold'
                      : 'text-gray-200 hover:bg-white/20 hover:text-white'
                  }`}
                  style={{
                    borderLeft: currentTheme === key ? `4px solid ${theme.colors.primary}` : 'none'
                  }}
                >
                  <span className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: theme.colors.primary }}
                    ></div>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

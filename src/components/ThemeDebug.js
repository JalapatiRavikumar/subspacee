import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeDebug() {
  const theme = useTheme();
  
  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-black/80 backdrop-blur-md rounded-lg text-white text-xs max-w-xs">
      <h3 className="font-bold mb-2">Theme Debug Info</h3>
      <div className="space-y-1">
        <div>Current Theme: {theme.currentTheme}</div>
        <div>Theme Name: {theme.currentThemeData?.name}</div>
        <div>Primary: {theme.currentThemeData?.colors?.primary}</div>
        <div>Secondary: {theme.currentThemeData?.colors?.secondary}</div>
        <div>Available Themes: {Object.keys(theme.themes).join(', ')}</div>
      </div>
      {/* Theme buttons removed */}
    </div>
  );
}

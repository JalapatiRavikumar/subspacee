import React from 'react';

const CosmicStyles = () => (
  <style>{`
    @keyframes move-aurora {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .aurora-bg {
      background: linear-gradient(-45deg, var(--theme-primary), var(--theme-secondary), var(--theme-accent), var(--theme-primary));
      background-size: 400% 400%;
      animation: move-aurora 12s ease infinite;
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 8px var(--glow-color), 0 0 14px var(--glow-color), 0 0 22px var(--glow-color); }
      50% { box-shadow: 0 0 16px var(--glow-color-brighter), 0 0 30px var(--glow-color-brighter), 0 0 50px var(--glow-color-brighter); }
    }
    .pulse-glow-anim {
      animation: pulse-glow 3s ease-in-out infinite;
    }
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .slide-in-anim {
      animation: slide-in 0.5s ease-out forwards;
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    .float-anim {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes rotate-3d {
      0% { transform: rotate3d(1, 1, 1, 0deg); }
      100% { transform: rotate3d(1, 1, 1, 360deg); }
    }
    .rotate-3d-anim {
      animation: rotate-3d 10s linear infinite;
    }
    
    @keyframes color-cycle {
      0% { color: var(--theme-primary); }
      33% { color: var(--theme-secondary); }
      66% { color: var(--theme-accent); }
      100% { color: var(--theme-primary); }
    }
    .color-cycle-anim {
      animation: color-cycle 10s linear infinite;
    }
    
    @keyframes border-glow {
      0%, 100% { border-color: var(--theme-primary); }
      50% { border-color: var(--theme-accent); }
    }
    .border-glow-anim {
      animation: border-glow 10s ease-in-out infinite;
      border-width: 2px;
      border-style: solid;
    }
  `}</style>
);

export default CosmicStyles;
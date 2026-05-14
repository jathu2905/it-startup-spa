import React from 'react';

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-1 font-orbitron ${className}`}>
      {/* "DUD" part */}
      <span className="text-2xl font-bold tracking-[0.1em] metallic-glow">
        DUD
      </span>
      
      {/* Custom "E" part */}
      <div className="flex flex-col justify-between h-[18px] w-[14px] py-[2px] metallic-glow-bg">
        <div className="h-[2.5px] w-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <div className="h-[2.5px] w-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        <div className="h-[2.5px] w-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      </div>
    </div>
  );
};

export default Logo;

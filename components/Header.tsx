import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
          LiveWire <span className="text-white/80 font-light">快讯</span>
        </h1>
      </div>
      <div className="flex flex-col items-end">
         <div className="text-xs text-slate-400 font-mono hidden sm:block">
          系统状态: 在线 | 模型: GEMINI-2.5-FLASH
        </div>
        <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          数据源: GOOGLE 搜索实时验证
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useEffect, useState } from 'react';
import { NewsItem } from '../types';

interface DetailModalProps {
  item: NewsItem | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsOpen(false);
      document.body.style.overflow = 'unset';
    }
  }, [item]);

  if (!item) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Content */}
      <div className={`
        relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl 
        flex flex-col max-h-[90vh] transform transition-all duration-300 overflow-hidden
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
      `}>
        
        {/* Header Image Placeholder or Pattern */}
        <div className="h-32 bg-gradient-to-r from-indigo-900 via-slate-800 to-slate-900 relative shrink-0">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
            {/* Gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors z-10"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="absolute bottom-4 left-6 right-16">
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${item.impactLevel === 'HIGH' ? 'bg-red-500 text-white' : 'bg-cyan-600 text-white'}`}>
                        {item.impactLevel === 'HIGH' ? '重磅突发' : '最新动态'}
                    </span>
                    <span className="text-[10px] bg-slate-800/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-1.75 17.5l-5.5-5.5 1.75-1.75 3.75 3.75 8.25-8.25 1.75 1.75-10 10z"/></svg>
                        搜索已验证
                    </span>
                 </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight shadow-black drop-shadow-md">{item.title}</h2>
            </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
            <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-mono border-b border-slate-800 pb-4">
                    <span className="text-slate-400">{item.timestamp}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="text-slate-600">ID: {item.id.substring(0, 8)}</span>
                </div>

                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                     {/* AI Disclaimer */}
                    <div className="bg-slate-800/50 border-l-2 border-cyan-500 p-3 mb-6 rounded-r text-xs text-slate-400 italic">
                        以下内容由 Gemini AI 基于实时网络搜索结果智能汇总生成。
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-base text-slate-200">
                        {item.fullContent}
                    </p>
                </div>

                {/* Sources Section */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                             <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                             信息来源 & 引用
                        </h4>
                        <span className="text-[10px] text-slate-500 uppercase">数据来自 Google 搜索</span>
                    </div>
                    
                    {item.sources && item.sources.length > 0 ? (
                        <div className="grid gap-2">
                            {item.sources.map((source, idx) => (
                                <a 
                                    key={idx}
                                    href={source.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm text-cyan-400 group-hover:text-cyan-300 font-medium truncate w-full">{source.title}</span>
                                            <span className="text-[10px] text-slate-500 truncate group-hover:text-slate-400">{new URL(source.uri).hostname}</span>
                                        </div>
                                    </div>
                                    <svg className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 italic">
                            暂无直接链接，内容基于搜索上下文生成。
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
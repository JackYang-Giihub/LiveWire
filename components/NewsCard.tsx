import React from 'react';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
  onClick: (item: NewsItem) => void;
  isRead?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, onClick, isRead = false }) => {
  const isHighImpact = item.impactLevel === 'HIGH';
  const sourceCount = item.sources ? item.sources.length : 0;

  return (
    <div 
      onClick={() => onClick(item)}
      className={`
        group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300
        flex flex-col justify-between border
        ${isRead 
          ? 'opacity-50 grayscale-[0.6] hover:opacity-100 hover:grayscale-0 hover:scale-[1.01]' 
          : 'hover:scale-[1.02] hover:shadow-2xl'
        }
        ${isHighImpact 
          ? isRead 
            ? 'bg-red-950/10 border-red-900/20' 
            : 'bg-red-950/20 border-red-500/30 hover:border-red-500/60' 
          : isRead
            ? 'bg-slate-800/20 border-slate-800/40'
            : 'bg-slate-800/40 border-slate-700/50 hover:border-cyan-500/50'
        }
      `}
    >
      {/* Decorative pulse for high impact (only if unread) */}
      {isHighImpact && !isRead && (
        <div className="absolute top-0 right-0 p-2 z-10">
           <span className="flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>
      )}

      {/* Read Indicator Icon (optional, subtle) */}
      {isRead && (
         <div className="absolute top-3 right-3 z-10 text-slate-600">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
         </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider ${
            isRead 
              ? 'bg-slate-700/30 text-slate-500' 
              : isHighImpact ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'
          }`}>
            {item.category.toUpperCase()}
          </span>
          <span className="text-xs text-slate-500 font-mono">{item.timestamp}</span>
        </div>
        
        <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${
            isRead 
             ? 'text-slate-400' 
             : isHighImpact ? 'text-white' : 'text-slate-100 group-hover:text-cyan-400'
        }`}>
          {item.title}
        </h3>
        
        <p className={`text-sm line-clamp-2 ${isRead ? 'text-slate-600' : 'text-slate-400'}`}>
          {item.summary}
        </p>
      </div>

      <div className={`px-5 pb-4 pt-0 flex items-center justify-between border-t mt-auto pt-3 ${isRead ? 'border-slate-800' : 'border-white/5'}`}>
        {/* Source reliability indicator */}
        <div className={`flex items-center gap-1.5 text-[10px] font-mono transition-colors ${
             isRead ? 'text-slate-600' : 'text-slate-500 group-hover:text-emerald-400'
        }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            {sourceCount > 0 ? `${sourceCount} 个权威信源` : 'AI 综合生成'}
        </div>

        <div className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            isRead ? 'text-slate-600' : 'text-slate-500 group-hover:text-cyan-400'
        }`}>
          <span>{isRead ? '回顾' : '阅读详情'}</span>
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
      
      {/* Background decoration (only unread) */}
      {!isRead && (
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:from-cyan-500/10 transition-colors pointer-events-none"></div>
      )}
    </div>
  );
};

export default NewsCard;
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import DetailModal from './components/DetailModal';
import { fetchBreakingNews } from './services/geminiService';
import { NewsItem } from './types';

const PRESET_TOPICS = [
  "人工智能新闻",
  "生物技术新闻",
  "军事新闻",
  "政治新闻",
  "经济新闻",
  "量子计算新闻",
  "A股上市公司最新财报披露情况",
  "港股上市公司最新财报披露",
  "美股上市公司最新财报披露"
];

const App: React.FC = () => {
  // Load saved topics from localStorage
  const [savedTopics, setSavedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('user_saved_topics');
    return saved ? JSON.parse(saved) : [];
  });

  // Default to the first topic in the list
  const [topic, setTopic] = useState<string>(PRESET_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [readNewsIds, setReadNewsIds] = useState<Set<string>>(new Set());

  const loadNews = useCallback(async (searchTopic: string) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchBreakingNews(searchTopic);
      setNews(items);
    } catch (err) {
      console.error(err);
      setError("获取最新新闻失败，请重试。");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNews(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount with default topic

  // Persist saved topics
  useEffect(() => {
    localStorage.setItem('user_saved_topics', JSON.stringify(savedTopics));
  }, [savedTopics]);

  const handleTopicClick = (t: string) => {
    setTopic(t);
    loadNews(t);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      setTopic(customTopic);
      loadNews(customTopic);
    }
  };

  const handleSaveTopic = () => {
    if (customTopic.trim() && !savedTopics.includes(customTopic.trim()) && !PRESET_TOPICS.includes(customTopic.trim())) {
      setSavedTopics(prev => [...prev, customTopic.trim()]);
      // Optional: clear input after save? kept for user context
    }
  };

  const handleDeleteTopic = (e: React.MouseEvent, t: string) => {
    e.stopPropagation(); // Prevent triggering the topic selection
    setSavedTopics(prev => prev.filter(item => item !== t));
    if (topic === t) {
      setTopic(PRESET_TOPICS[0]);
      loadNews(PRESET_TOPICS[0]);
    }
  };

  const handleCardClick = (item: NewsItem) => {
    setSelectedItem(item);
    if (!readNewsIds.has(item.id)) {
      setReadNewsIds(prev => {
        const newSet = new Set(prev);
        newSet.add(item.id);
        return newSet;
      });
    }
  };

  const clearReadHistory = () => {
    setReadNewsIds(new Set());
  };

  // Combine topics for check
  const allTopics = [...PRESET_TOPICS, ...savedTopics];
  const isCustomTopicSaved = allTopics.includes(customTopic.trim());

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-cyan-500/30">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Controls Section */}
        <section className="mb-10">
          <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
            
            {/* Topic Pills */}
            <div className="flex flex-wrap gap-2 justify-start flex-1">
              {PRESET_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTopicClick(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shrink-0 ${
                    topic === t 
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/50' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
              
              {/* Saved User Topics */}
              {savedTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTopicClick(t)}
                  className={`group relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border shrink-0 pr-8 ${
                    topic === t 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' 
                      : 'bg-slate-800/80 border-indigo-500/30 text-indigo-300 hover:bg-slate-700 hover:text-indigo-200'
                  }`}
                >
                  {t}
                  <span 
                    onClick={(e) => handleDeleteTopic(e, t)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 text-indigo-200 hover:text-white transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input & Save */}
            <div className="w-full xl:w-auto mt-4 xl:mt-0 flex gap-2">
              <form onSubmit={handleSearch} className="relative flex-1 xl:w-64">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="探索新话题..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </form>
              
              {customTopic.trim() && !isCustomTopicSaved && (
                <button
                  onClick={handleSaveTopic}
                  className="px-3 py-2 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white rounded-lg transition-all duration-200 flex items-center gap-1 text-sm whitespace-nowrap"
                  title="保存为常用板块"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="hidden sm:inline">保存板块</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Status Indicator & Read Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-2">
          <h2 className="text-xl font-light text-slate-100 flex items-center gap-2">
            <span className="font-bold text-cyan-400">信息流</span> // {topic}
          </h2>
          
          <div className="flex items-center gap-4">
             {/* Clear Read History Button */}
             {readNewsIds.size > 0 && (
                <button 
                  onClick={clearReadHistory}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors bg-slate-800/50 hover:bg-slate-800 px-3 py-1 rounded-full border border-slate-700/50"
                  title="清除已读标记"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  清除已读 ({readNewsIds.size})
                </button>
             )}

             {loading ? (
               <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  正在扫描全球数据...
               </div>
             ) : (
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-500 font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  实时连接就绪
                </div>
             )}
          </div>
        </div>

        {/* Content Grid */}
        {error ? (
          <div className="p-8 text-center border border-red-900/50 rounded-xl bg-red-950/10">
            <p className="text-red-400 mb-2">{error}</p>
            <button onClick={() => loadNews(topic)} className="text-sm underline text-slate-400 hover:text-white">重试连接</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard 
                key={item.id} 
                item={item} 
                onClick={handleCardClick} 
                isRead={readNewsIds.has(item.id)}
              />
            ))}
            
            {/* Empty State */}
            {!loading && news.length === 0 && (
              <div className="col-span-full py-20 text-center opacity-50">
                <p className="text-xl font-light text-slate-500">等待信号接入...</p>
                <p className="text-sm text-slate-600 mt-2">请尝试选择不同的频道（话题）或输入新的关键词。</p>
              </div>
            )}
            
            {/* Immersive Pulsating Logo Loading State */}
            {loading && news.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative flex items-center justify-center">
                   {/* Pulsing Orbs */}
                   <div className="absolute w-40 h-40 bg-cyan-500/10 rounded-full animate-ping"></div>
                   <div className="absolute w-32 h-32 bg-blue-600/10 rounded-full animate-pulse delay-150"></div>
                   
                   {/* Center Hex/Icon */}
                   <div className="relative z-10 w-24 h-24 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-2xl"></div>
                      <svg className="w-12 h-12 text-cyan-400 animate-[pulse_2s_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                   </div>
                </div>
                
                <div className="mt-12 text-center space-y-3">
                   <h3 className="text-xl font-bold text-white tracking-[0.3em] uppercase">
                     正在接入全球信号
                   </h3>
                   <div className="flex items-center justify-center gap-1.5 opacity-80">
                     <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms]"></span>
                     <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms]"></span>
                     <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_500ms]"></span>
                   </div>
                   <p className="text-xs text-cyan-500/60 font-mono tracking-wider">
                     TARGET: <span className="text-cyan-400/80">{topic}</span>
                   </p>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <DetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
};

export default App;
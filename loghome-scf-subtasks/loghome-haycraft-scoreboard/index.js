import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, List, Save, RotateCcw, CheckCircle, Download } from 'lucide-react';

// --- 配置常量 ---

const CRITERIA = [
  {
    id: 'creativity',
    name: '一、创意性',
    max: 40,
    sub: [
      { id: 'c_novelty', name: '新颖度', max: 10, desc: '构思、叙事角度、世界观或表达的新颖性' },
      { id: 'c_depth', name: '深刻与独特性', max: 10, desc: '主题深度，视角独特，引发共鸣' },
      { id: 'c_relevance', name: '切题性', max: 10, desc: 'MC主题契合度，自然融入' },
      { id: 'c_values', name: '价值导向', max: 10, desc: '积极、健康、富有建设性' },
    ]
  },
  {
    id: 'story',
    name: '二、故事性与情节',
    max: 30,
    sub: [
      { id: 's_integrity', name: '完整与节奏', max: 10, desc: '结构完整，起承转合，节奏把控' },
      { id: 's_conflict', name: '冲突与悬念', max: 10, desc: '冲突有力，悬念吸引人' },
      { id: 's_logic', name: '逻辑与合理性', max: 10, desc: '符合逻辑，MC世界观自洽' },
    ]
  },
  {
    id: 'character',
    name: '三、人物塑造',
    max: 15,
    sub: [
      { id: 'ch_vivid', name: '鲜明与可信', max: 10, desc: '立体鲜活，动机可信' },
      { id: 'ch_growth', name: '成长与变化', max: 5, desc: '清晰合理的成长轨迹' },
    ]
  },
  {
    id: 'writing',
    name: '四、文笔',
    max: 15,
    sub: [
      { id: 'w_accuracy', name: '准确流畅', max: 10, desc: '精炼准确，无病句错字' },
      { id: 'w_style', name: '表现力与风格', max: 5, desc: '生动形象，感染力，个人风格' },
    ]
  }
];

const PRESET_WORKS = [
  { title: '《可是勇者不是已经死了吗》', communityScore: 20 },
  { title: '《五粒可可豆》', communityScore: 18 },
  { title: '《自黑暗中来》', communityScore: 16 },
  { title: '《溯》', communityScore: 12 },
  { title: '《非正式事件·删减版》', communityScore: 12 },
  { title: '《剑心犹在》', communityScore: 12 },
  { title: '《真实频率》', communityScore: 8 }
];

const STORAGE_KEY_DATA = 'mc_review_data';
const STORAGE_KEY_HISTORY = 'mc_review_history';
const MAX_HISTORY_ITEMS = 500;

const buildInitialWorks = (savedWorks) => {
  const savedByTitle = new Map(
    Array.isArray(savedWorks) ? savedWorks.map(w => [w.title, w]) : []
  );

  return PRESET_WORKS.map((preset, index) => {
    const saved = savedByTitle.get(preset.title);
    const scores = {};
    CRITERIA.forEach(cat => {
      cat.sub.forEach(sub => {
        scores[sub.id] = saved?.scores?.[sub.id] ?? 0;
      });
    });

    return {
      id: `preset-${index + 1}`,
      title: preset.title,
      scores,
      communityScore: preset.communityScore,
      reviewText: saved?.reviewText ?? '',
      timestamp: saved?.timestamp ?? Date.now()
    };
  });
};

const readJsonFromStorage = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

const appendHistorySnapshot = (snapshot) => {
  const prev = readJsonFromStorage(STORAGE_KEY_HISTORY);
  const next = Array.isArray(prev) ? [...prev, snapshot] : [snapshot];
  const sliced = next.length > MAX_HISTORY_ITEMS ? next.slice(next.length - MAX_HISTORY_ITEMS) : next;
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(sliced));
};

const downloadJson = (filename, data) => {
  const jsonText = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// --- 辅助组件 ---

const ScoreInput = ({ value, onChange, max, label, desc }) => (
  <div className="mb-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
    <div className="flex justify-between items-center mb-1">
      <label className="font-medium text-gray-800 text-sm">{label}</label>
      <span className="text-blue-600 font-bold text-sm">{value} / {max}</span>
    </div>
    <div className="text-xs text-gray-500 mb-3">{desc}</div>
    <div className="flex items-center gap-3">
      <button 
        onClick={() => onChange(Math.max(0, value - 0.5))}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-200"
      >
        -
      </button>
      <input 
        type="range" 
        min="0" 
        max={max} 
        step="0.5" 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <button 
        onClick={() => onChange(Math.min(max, value + 0.5))}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-200"
      >
        +
      </button>
    </div>
  </div>
);

// --- 主应用组件 ---

export default function ReviewApp() {
  const initialWorksRef = useRef(null);
  if (initialWorksRef.current === null) {
    initialWorksRef.current = buildInitialWorks(readJsonFromStorage(STORAGE_KEY_DATA));
  }

  const [works, setWorks] = useState(initialWorksRef.current);
  const [activeTab, setActiveTab] = useState('list'); // list, edit, compare
  const [currentWorkId, setCurrentWorkId] = useState(initialWorksRef.current[0]?.id ?? null);
  const [compareSortBy, setCompareSortBy] = useState('total'); // Lifted state for CompareView
  const hasLoadedRef = useRef(false);
  const saveTimerRef = useRef(null);
  
  useEffect(() => {
    hasLoadedRef.current = true;
  }, []);

  // 自动保存
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(works));
    }, 250);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [works]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(works));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [works]);

  const updateScore = (workId, fieldId, value) => {
    setWorks(prevWorks => {
      const ts = Date.now();
      const nextWorks = prevWorks.map(w => {
        if (w.id !== workId) return w;
        return {
          ...w,
          scores: { ...w.scores, [fieldId]: value },
          timestamp: ts
        };
      });

      if (hasLoadedRef.current) {
        appendHistorySnapshot({
          type: 'score_change',
          timestamp: ts,
          workId,
          fieldId,
          value,
          works: nextWorks
        });
      }

      return nextWorks;
    });
  };

  const updateReviewText = (workId, text) => {
    setWorks(prevWorks => {
      const ts = Date.now();
      const nextWorks = prevWorks.map(w => {
        if (w.id !== workId) return w;
        return {
          ...w,
          reviewText: text,
          timestamp: ts
        };
      });

      return nextWorks;
    });
  };

  const commitReviewSnapshot = (workId, reviewText) => {
    if (!hasLoadedRef.current) return;
    setWorks(prevWorks => {
      const ts = Date.now();
      const nextWorks = prevWorks.map(w => {
        if (w.id !== workId) return w;
        if ((w.reviewText ?? '') === reviewText) return w;
        return { ...w, reviewText, timestamp: ts };
      });
      appendHistorySnapshot({
        type: 'review_change',
        timestamp: ts,
        workId,
        reviewText,
        works: nextWorks
      });
      return nextWorks;
    });
  };

  const exportCurrentScores = () => {
    const ts = new Date();
    const pad2 = (n) => String(n).padStart(2, '0');
    const filename = `haycraft_scores_${ts.getFullYear()}${pad2(ts.getMonth() + 1)}${pad2(ts.getDate())}_${pad2(ts.getHours())}${pad2(ts.getMinutes())}${pad2(ts.getSeconds())}.json`;

    const payload = {
      meta: {
        exportedAt: ts.toISOString(),
        worksCount: works.length
      },
      criteria: CRITERIA,
      works: works.map(w => ({
        id: w.id,
        title: w.title,
        juryTotal: Number(calculateTotal(w).toFixed(1)),
        woodScore: w.communityScore,
        finalTotal: Number(calculateGrandTotal(w).toFixed(1)),
        scores: w.scores,
        reviewText: w.reviewText ?? '',
        updatedAt: w.timestamp
      }))
    };

    downloadJson(filename, payload);
  };

  const calculateTotal = (work) => {
    let juryTotal = 0;
    Object.values(work.scores).forEach(s => juryTotal += (s || 0));
    return juryTotal;
  };

  const calculateGrandTotal = (work) => {
    return calculateTotal(work) + (work.communityScore || 0);
  };

  const calculateCategoryScore = (work, categoryId) => {
    const category = CRITERIA.find(c => c.id === categoryId);
    let total = 0;
    category.sub.forEach(sub => {
      total += (work.scores[sub.id] || 0);
    });
    return total;
  };

  // --- 视图组件 ---

  const renderListView = () => (
    <div className="space-y-4 pb-20">
      <div className="space-y-3">
        {works.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            暂无作品
          </div>
        )}
        {works.map(work => {
          const juryScore = calculateTotal(work);
          const totalScore = calculateGrandTotal(work);
          
          return (
            <div key={work.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-blue-500 relative">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-lg truncate w-2/3">{work.title}</h3>
                <div className="text-right">
                   <div className="text-xs text-gray-500">最终总分</div>
                   <div className="text-xl font-bold text-blue-700">{totalScore.toFixed(1)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                 <div>评审团分: <span className="font-bold">{juryScore.toFixed(1)}</span></div>
                 <div>原木力附加: <span className="font-bold">{work.communityScore}</span></div>
              </div>

              {Boolean(work.reviewText?.trim()) && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-3">
                  <div className="font-medium text-gray-600 mb-1">总评</div>
                  <div className="whitespace-pre-wrap break-words line-clamp-3">{work.reviewText}</div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => { setCurrentWorkId(work.id); setActiveTab('edit'); }}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100"
                >
                  评分 / 修改
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderEditView = () => {
    const work = works.find(w => w.id === currentWorkId);
    if (!work) return null;

    // 计算当前评审团总分
    const currentJuryTotal = calculateTotal(work);
    const currentFinalTotal = calculateGrandTotal(work);

    return (
      <div className="pb-20">
        <div className="bg-white sticky top-0 z-10 p-4 border-b shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setActiveTab('list')} className="text-gray-500 flex items-center text-sm">
              &larr; 返回列表
            </button>
            <div className="text-right">
              <div className="text-xs text-gray-500">当前评审分</div>
              <div className={`font-bold text-xl ${currentJuryTotal > 100 ? 'text-red-500' : 'text-blue-600'}`}>
                {currentJuryTotal.toFixed(1)} / 100
              </div>
            </div>
          </div>
          <h2 className="font-bold text-xl mt-1">{work.title}</h2>
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>原木力附加: <span className="font-bold">{work.communityScore}</span></span>
            <span>最终总分: <span className="font-bold text-blue-700">{currentFinalTotal.toFixed(1)}</span> / 120</span>
          </div>
        </div>

        <div className="px-4 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">总评 / 打分理由</h3>
              <span className="text-xs text-gray-400">{(work.reviewText ?? '').length} 字</span>
            </div>
            <textarea
              value={work.reviewText ?? ''}
              onChange={(e) => updateReviewText(work.id, e.target.value)}
              onBlur={(e) => commitReviewSnapshot(work.id, e.target.value)}
              placeholder="写下你对这个作品的总体评价与打分理由…"
              rows={6}
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none"
            />
          </div>

          {CRITERIA.map(cat => (
            <div key={cat.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-gray-100 p-3 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">{cat.name}</h3>
                <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                  {calculateCategoryScore(work, cat.id).toFixed(1)} / {cat.max}
                </span>
              </div>
              <div className="p-3">
                {cat.sub.map(sub => (
                  <ScoreInput
                    key={sub.id}
                    label={sub.name}
                    desc={sub.desc}
                    max={sub.max}
                    value={work.scores[sub.id]}
                    onChange={(val) => updateScore(work.id, sub.id, val)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCompareView = () => {
    const sortBy = compareSortBy;
    const setSortBy = setCompareSortBy;
    
    // 对works进行排序
    const sortedWorks = [...works].sort((a, b) => {
      if (sortBy === 'total') return calculateGrandTotal(b) - calculateGrandTotal(a);
      return calculateCategoryScore(b, sortBy) - calculateCategoryScore(a, sortBy);
    });

    const categories = [
      { id: 'total', label: '最终总分 (120)' },
      ...CRITERIA.map(c => ({ id: c.id, label: `${c.name.split('、')[1]} (${c.max})` }))
    ];

    return (
      <div className="pb-20 h-full flex flex-col">
        <div className="bg-white p-4 border-b sticky top-0 z-10">
          <h2 className="text-lg font-bold mb-3">横向比对看板</h2>
          <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSortBy(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${
                  sortBy === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
           <div className="text-xs text-gray-500 mb-2 text-center">
             * 按照 <span className="font-bold text-blue-600">{categories.find(c => c.id === sortBy).label}</span> 从高到低排序
           </div>
           
           <div className="space-y-3">
             {sortedWorks.map((work, index) => {
               const focusScore = sortBy === 'total' ? calculateGrandTotal(work) : calculateCategoryScore(work, sortBy);
               const maxScore = sortBy === 'total' ? 120 : CRITERIA.find(c => c.id === sortBy).max;
               const percent = (focusScore / maxScore) * 100;
               
               return (
                 <div key={work.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                     index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
                   }`}>
                     {index + 1}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-end mb-1">
                        <span className="font-medium truncate text-gray-800">{work.title}</span>
                        <span className="font-mono font-bold text-blue-600 text-lg">{focusScore.toFixed(1)}</span>
                     </div>
                     {/* 进度条可视化 */}
                     <div className="w-full bg-gray-100 rounded-full h-2">
                       <div 
                         className={`h-2 rounded-full ${
                           percent > 90 ? 'bg-green-500' : percent > 75 ? 'bg-blue-500' : percent > 60 ? 'bg-yellow-400' : 'bg-red-400'
                         }`}
                         style={{ width: `${percent}%` }}
                       ></div>
                     </div>
                     
                     {/* 如果是单项比对，显示简要的雷达数据 */}
                     {sortBy !== 'total' && (
                        <div className="mt-2 text-xs text-gray-400 flex gap-2">
                          <span>最终: {calculateGrandTotal(work).toFixed(1)}</span>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => { setCurrentWorkId(work.id); setActiveTab('edit'); }} className="text-blue-400 underline">
                            修改
                          </button>
                        </div>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    );
  };

  // --- 底部导航 ---

  return (
    <div className="max-w-md mx-auto h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* 顶部标题栏 (仅在非编辑模式显示，因为编辑模式有自己的头部) */}
      {activeTab !== 'edit' && (
        <div className="bg-white p-4 shadow-sm z-20 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white">
              <CheckCircle size={20} />
            </div>
            <h1 className="font-bold text-lg">干草块杯作品评审</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCurrentScores}
              className="text-gray-400 hover:text-blue-600"
              title="导出评分 JSON"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => {
                if(confirm('确定要清空所有数据吗？')) {
                  const ts = Date.now();
                  const initialWorks = buildInitialWorks();
                  setWorks(initialWorks);
                  setCurrentWorkId(initialWorks[0]?.id ?? null);
                  if (hasLoadedRef.current) {
                    appendHistorySnapshot({
                      type: 'reset',
                      timestamp: ts,
                      works: initialWorks
                    });
                  }
                }
              }}
              className="text-gray-400 hover:text-red-500"
              title="清空评分（重置为初始作品）"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'list' && renderListView()}
        {activeTab === 'edit' && renderEditView()}
        {activeTab === 'compare' && renderCompareView()}
      </div>

      {/* 底部导航栏 */}
      <div className="bg-white border-t border-gray-200 flex justify-around items-center h-16 shrink-0 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'list' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <List size={22} />
          <span className="text-xs font-medium">作品列表</span>
        </button>
        
        <button 
          onClick={() => {
             if (currentWorkId) setActiveTab('edit');
             else if (works.length > 0) { setCurrentWorkId(works[0].id); setActiveTab('edit'); }
             else alert('暂无作品');
          }}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'edit' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <div className="relative">
             <Save size={22} />
             {currentWorkId && activeTab !== 'edit' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
          </div>
          <span className="text-xs font-medium">当前打分</span>
        </button>

        <button 
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center ${activeTab === 'compare' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <BarChart2 size={22} />
          <span className="text-xs font-medium">横向比对</span>
        </button>
      </div>
    </div>
  );
}

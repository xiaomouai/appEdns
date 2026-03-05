import React from 'react';
import { ShieldCheck, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Skill } from '../types';

interface SkillMarketProps {
  skills: Skill[];
  userSkills: Skill[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onBuy: (itemId: string, itemType: string, amount: number) => void;
}

export const SkillMarket: React.FC<SkillMarketProps> = ({ 
  skills, 
  userSkills, 
  selectedCategory, 
  setSelectedCategory, 
  onBuy 
}) => {
  const filteredSkills = selectedCategory === '全部' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">技能市场</h2>
          <p className="text-slate-500 text-sm mt-1">为你的 AI 员工装备更强大的专业能力，提升业务效率</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['全部', '语言', '编程', '行政', '数据'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-200 ${
                selectedCategory === cat 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSkills.map((skill, index) => {
          const isOwned = userSkills.some(us => us.id === skill.id);
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={skill.id} 
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 border border-slate-100">
                  {skill.category}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{skill.name}</h3>
                <p className="text-xs text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">价格</span>
                  <span className="text-lg font-black text-slate-900">¥{skill.price}</span>
                </div>
                
                {isOwned ? (
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl flex items-center border border-emerald-100">
                    <ShieldCheck size={14} className="mr-1.5" />
                    已拥有
                  </div>
                ) : (
                  <button 
                    onClick={() => onBuy(skill.id, 'skill', skill.price)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-sm active:scale-95"
                  >
                    立即购买
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {filteredSkills.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={32} />
          </div>
          <p className="text-slate-400 font-medium">该分类下暂无技能</p>
          <button 
            onClick={() => setSelectedCategory('全部')}
            className="mt-4 text-emerald-600 text-sm font-bold hover:underline"
          >
            查看全部技能
          </button>
        </div>
      )}
    </div>
  );
};

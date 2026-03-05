import React from 'react';
import { Box } from 'lucide-react';

interface SkillCreatorProps {
  newSkill: any;
  setNewSkill: (skill: any) => void;
  onPublish: () => Promise<void>;
}

export const SkillCreator: React.FC<SkillCreatorProps> = ({ newSkill, setNewSkill, onPublish }) => {
  const [isPackaging, setIsPackaging] = React.useState(false);

  const handlePublish = async () => {
    setIsPackaging(true);
    await onPublish();
    setIsPackaging(false);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">技能上线</h2>
        <p className="text-slate-500 text-sm mb-8">创建并发布你的专属 AI 技能，让更多机构受益</p>

        <div className="space-y-6">
          {/* ... existing fields ... */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">技能名称</label>
              <input 
                type="text" 
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                placeholder="例如：雅思作文批改"
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">所属分类</label>
              <select 
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option>语言</option>
                <option>编程</option>
                <option>行政</option>
                <option>数据</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">技能描述</label>
            <textarea 
              rows={4}
              value={newSkill.description}
              onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
              placeholder="详细描述该技能的功能、适用场景及预期效果..."
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">建议售价 (¥)</label>
              <input 
                type="number" 
                value={newSkill.price}
                onChange={(e) => setNewSkill({...newSkill, price: parseInt(e.target.value)})}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">图标 (Emoji)</label>
              <input 
                type="text" 
                value={newSkill.icon}
                onChange={(e) => setNewSkill({...newSkill, icon: e.target.value})}
                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-lg text-emerald-600">
                <Box size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">云端打包与初始化</h4>
                <p className="text-xs text-emerald-700 mt-1">发布后，系统将自动进行环境打包、依赖安装及模型微调初始化。该过程通常需要 2-5 分钟。</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePublish}
            disabled={!newSkill.name || !newSkill.description || isPackaging}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isPackaging ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>正在进行云端打包与初始化...</span>
              </>
            ) : (
              <span>立即发布并打包技能</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

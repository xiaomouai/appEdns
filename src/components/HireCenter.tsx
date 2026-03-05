import React from 'react';
import { Bot, CreditCard } from 'lucide-react';
import { Stats } from '../types';

interface HireCenterProps {
  stats: Stats | null;
  onBuy: (itemId: string, itemType: string, amount: number) => void;
  onNavigateToRecharge: () => void;
}

export const HireCenter: React.FC<HireCenterProps> = ({ stats, onBuy, onNavigateToRecharge }) => {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">雇佣中心</h2>
          <p className="text-slate-500 text-sm mt-1">选择适合你业务的 AI 员工</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <CreditCard size={18} className="text-emerald-600" />
          <span className="text-sm font-bold text-slate-900">余额: ¥{stats?.balance || 0}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-500">可雇佣的 AI 员工</h3>
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
              <Bot size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900">全能员工</h4>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                搜索调研 · 文档写作 · 代码开发 · UI 设计 · 社媒运营 · 邮件处理 · 会议纪要 · 广告投放 · 多 Agent 协作
              </p>
              <p className="text-sm text-slate-500 max-w-2xl italic">
                "由 Claude / GPT / Gemini / Kimi 等顶级模型驱动，打通飞书、Telegram、Slack 等主流平台，7x24 小时在岗，一个员工覆盖助理、运营、开发、设计全岗位。"
              </p>
              <p className="text-emerald-600 font-bold">¥299 / 月</p>
            </div>
          </div>
          <button 
            onClick={() => onBuy('agent-all', 'agent', 299)}
            className="bg-[#E67E5F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#D46D4F] transition-colors shrink-0"
          >
            立即雇佣
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-500">员工名额</h3>
          <span className="text-sm text-slate-500">已雇佣 {stats?.hiredCount || 0} / {stats?.quota || 0} 名员工</span>
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#E67E5F]" 
              style={{ width: stats && stats.quota > 0 ? `${(stats.hiredCount / stats.quota) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">剩余 {(stats?.quota || 0) - (stats?.hiredCount || 0)} 个名额</span>
            <button onClick={onNavigateToRecharge} className="text-[#E67E5F] font-bold hover:underline">充值更多积分，可解锁更多员工名额 去充值 →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

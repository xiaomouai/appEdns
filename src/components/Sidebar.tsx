import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Bot, 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Box, 
  Plus, 
  Globe, 
  CreditCard, 
  Users2, 
  Fish, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: User;
  onLogout: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: { icon: any, label: string, active: boolean, onClick: () => void, collapsed: boolean }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-emerald-50 text-emerald-700 font-medium' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    } ${collapsed ? 'justify-center px-0' : ''}`}
  >
    <Icon size={20} className="shrink-0" />
    {!collapsed && <span className="text-sm whitespace-nowrap overflow-hidden">{label}</span>}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, user, onLogout }) => {
  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-white border-r border-slate-200 flex flex-col relative shrink-0 h-screen"
    >
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#E67E5F] rounded-lg flex items-center justify-center text-white shadow-md shrink-0">
          <Bot size={20} />
        </div>
        {!isCollapsed && (
          <div className="flex items-baseline space-x-0.5">
            <span className="text-lg font-bold tracking-tight text-slate-900">EasyClaw</span>
            <span className="text-xs text-slate-400 font-medium">.work</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-x-hidden overflow-y-auto">
        <SidebarItem icon={TrendingUp} label="数据看板" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={isCollapsed} />
        <SidebarItem icon={ShoppingBag} label="雇佣中心" active={activeTab === 'hire_center'} onClick={() => setActiveTab('hire_center')} collapsed={isCollapsed} />
        <SidebarItem icon={Bot} label="我的员工" active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} collapsed={isCollapsed} />
        <SidebarItem icon={LayoutDashboard} label="任务中心" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} collapsed={isCollapsed} />
        <SidebarItem icon={Users} label="学生管理" active={activeTab === 'students'} onClick={() => setActiveTab('students')} collapsed={isCollapsed} />
        <SidebarItem icon={MessageSquare} label="对话" active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} collapsed={isCollapsed} />
        <SidebarItem icon={Box} label="技能市场" active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} collapsed={isCollapsed} />
        <SidebarItem icon={Plus} label="技能上线" active={activeTab === 'skill_creator'} onClick={() => setActiveTab('skill_creator')} collapsed={isCollapsed} />
        <SidebarItem icon={Globe} label="模型列表" active={activeTab === 'models'} onClick={() => setActiveTab('models')} collapsed={isCollapsed} />
        <SidebarItem icon={CreditCard} label="充值" active={activeTab === 'recharge'} onClick={() => setActiveTab('recharge')} collapsed={isCollapsed} />
        
        <div className="pt-4 mt-4 border-t border-slate-100">
          <SidebarItem icon={Users2} label="交流群" active={activeTab === 'community'} onClick={() => setActiveTab('community')} collapsed={isCollapsed} />
          <SidebarItem icon={Fish} label="龙虾代养" active={activeTab === 'lobster'} onClick={() => setActiveTab('lobster')} collapsed={isCollapsed} />
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className={`flex items-center space-x-3 px-4 py-3 mb-2 ${isCollapsed ? 'justify-center px-0' : ''}`}>
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
            {user.name[0]}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          )}
        </div>
        <SidebarItem icon={Settings} label="机构设置" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={isCollapsed} />
        <button 
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors mt-2 ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="text-sm">退出登录</span>}
        </button>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 shadow-sm z-10"
      >
        <ChevronRight size={14} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
      </button>
    </motion.aside>
  );
};

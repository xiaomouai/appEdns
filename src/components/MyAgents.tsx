import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { Agent } from '../types';

interface MyAgentsProps {
  agents: Agent[];
  onConfigureSkills: (agent: Agent) => void;
  onHireNew: () => void;
}

export const MyAgents: React.FC<MyAgentsProps> = ({ agents, onConfigureSkills, onHireNew }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">AI 教师管理</h2>
        <button 
          onClick={onHireNew}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          <span>雇佣新教师</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <motion.div 
            layoutId={agent.id}
            key={agent.id} 
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{agent.avatar}</div>
              <div>
                <h3 className="font-bold text-slate-900">{agent.name}</h3>
                <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  {agent.role}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{agent.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {agent.skills.split(',').map(skill => (
                <span key={skill} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onConfigureSkills(agent)}
                className="flex-1 bg-slate-900 text-white text-sm py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                配置技能
              </button>
              <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                <Settings size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

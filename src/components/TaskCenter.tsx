import React from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Agent, Skill, Student } from '../types';

interface TaskCenterProps {
  agents: Agent[];
  userSkills: Skill[];
  students: Student[];
  taskAgent: Agent | null;
  setTaskAgent: (agent: Agent | null) => void;
  taskSkill: Skill | null;
  setTaskSkill: (skill: Skill | null) => void;
  taskStudent: Student | null;
  setTaskStudent: (student: Student | null) => void;
  taskResult: string | null;
  isExecutingTask: boolean;
  onExecute: () => void;
}

export const TaskCenter: React.FC<TaskCenterProps> = ({
  agents,
  userSkills,
  students,
  taskAgent,
  setTaskAgent,
  taskSkill,
  setTaskSkill,
  taskStudent,
  setTaskStudent,
  taskResult,
  isExecutingTask,
  onExecute
}) => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">任务中心</h2>
        <p className="text-slate-500 text-sm mb-8">在这里运行你的 AI 员工，执行具体任务并获取反馈</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">选择执行员工</label>
            <select 
              value={taskAgent?.id || ''}
              onChange={(e) => setTaskAgent(agents.find(a => a.id === e.target.value) || null)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">请选择员工</option>
              {agents.map(a => <option key={a.id} value={a.id}>{a.avatar} {a.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">选择专业技能</label>
            <select 
              value={taskSkill?.id || ''}
              onChange={(e) => setTaskSkill(userSkills.find(s => s.id === e.target.value) || null)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">请选择技能</option>
              {userSkills.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">选择服务学生</label>
            <select 
              value={taskStudent?.id || ''}
              onChange={(e) => setTaskStudent(students.find(s => s.id === e.target.value) || null)}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">请选择学生</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={onExecute}
          disabled={!taskAgent || !taskSkill || !taskStudent || isExecutingTask}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isExecutingTask ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>正在初始化并执行任务...</span>
            </>
          ) : (
            <>
              <TrendingUp size={20} />
              <span>开始执行任务</span>
            </>
          )}
        </button>
      </div>

      {taskResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-100/20"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">执行结果反馈</h3>
              <p className="text-xs text-slate-500">任务已完成 · 结果已同步至学生档案</p>
            </div>
          </div>
          <div className="prose prose-slate max-w-none">
            <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {taskResult}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">存为草稿</button>
            <button className="px-6 py-2 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">发送给家长</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

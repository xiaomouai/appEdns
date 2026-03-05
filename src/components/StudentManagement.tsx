import React from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Student } from '../types';

export const StudentManagement: React.FC<{ students: Student[] }> = ({ students }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-bottom border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">学生档案</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索学生姓名..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-64"
          />
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 font-medium">姓名</th>
            <th className="px-6 py-4 font-medium">年级</th>
            <th className="px-6 py-4 font-medium">综合评分</th>
            <th className="px-6 py-4 font-medium">AI 干预状态</th>
            <th className="px-6 py-4 font-medium">最后活跃</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">
                    {student.name[0]}
                  </div>
                  <span className="text-sm font-medium text-slate-900">{student.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{student.grade}</td>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${student.performance_score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{student.performance_score}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  正在规划路径
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-slate-400">
                {new Date(student.last_active).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-2 text-slate-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

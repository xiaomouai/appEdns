import React from 'react';
import { Users, Bot, ShieldCheck, TrendingUp } from 'lucide-react';
import { Stats } from '../types';

const StatCard = ({ label, value, trend, icon: Icon }: { label: string, value: string | number, trend: string, icon: any }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
        <Icon size={20} />
      </div>
      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm mb-1">{label}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

export const Dashboard: React.FC<{ stats: Stats | null }> = ({ stats }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="在读学生" value={stats?.totalStudents.count || 0} trend="+12%" icon={Users} />
        <StatCard label="活跃AI教师" value={stats?.activeAgents.count || 0} trend="运行中" icon={Bot} />
        <StatCard label="本月完成任务" value={stats?.tasksCompleted || 0} trend="+24%" icon={ShieldCheck} />
        <StatCard label="学生留存率" value={stats?.retentionRate || '0%'} trend="+5%" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">学生表现热图</h2>
            <button className="text-sm text-emerald-600 font-medium">查看详情</button>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">数据图表加载中...</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">异常告警</h2>
          <div className="space-y-4">
            {[
              { title: '学习停滞', student: '小华', time: '2小时前', type: 'warning' },
              { title: '缺勤提醒', student: '小明', time: '5小时前', type: 'error' },
              { title: '情绪波动', student: '小红', time: '昨天', type: 'info' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50">
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  alert.type === 'error' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{alert.title}: {alert.student}</p>
                  <p className="text-xs text-slate-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

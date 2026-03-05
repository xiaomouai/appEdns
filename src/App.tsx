import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  X,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Agent, Student, Stats, Skill, Order, User } from './types';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { HireCenter } from './components/HireCenter';
import { MyAgents } from './components/MyAgents';
import { TaskCenter } from './components/TaskCenter';
import { StudentManagement } from './components/StudentManagement';
import { SkillMarket } from './components/SkillMarket';
import { SkillCreator } from './components/SkillCreator';
import { ModelList } from './components/ModelList';
import { Recharge } from './components/Recharge';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('claw_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isChatting, setIsChatting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [agentToConfigure, setAgentToConfigure] = useState<Agent | null>(null);

  // Task Center State
  const [taskAgent, setTaskAgent] = useState<Agent | null>(null);
  const [taskSkill, setTaskSkill] = useState<Skill | null>(null);
  const [taskStudent, setTaskStudent] = useState<Student | null>(null);
  const [taskResult, setTaskResult] = useState<string | null>(null);
  const [isExecutingTask, setIsExecutingTask] = useState(false);

  // Skill Creator State
  const [newSkill, setNewSkill] = useState({ name: '', category: '语言', description: '', price: 99, icon: '🛠️' });

  const fetchData = async () => {
    if (!user) return;
    try {
      const [agentsRes, studentsRes, statsRes, skillsRes, ordersRes, userSkillsRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/students'),
        fetch(`/api/stats?userId=${user.id}`),
        fetch('/api/skills'),
        fetch('/api/orders'),
        fetch(`/api/user-skills?userId=${user.id}`)
      ]);
      
      if (agentsRes.ok) setAgents(await agentsRes.json());
      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (userSkillsRes.ok) setUserSkills(await userSkillsRes.json());
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLogin = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('claw_user', JSON.stringify(data.user));
    } else {
      alert(data.error);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('claw_user', JSON.stringify(data.user));
    } else {
      alert(data.error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('claw_user');
  };

  const handleRecharge = async (amount: number) => {
    if (!user) return;
    try {
      const res = await fetch('/api/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, userId: user.id })
      });
      if (res.ok) {
        await fetchData();
        alert('充值成功！');
      }
    } catch (error) {
      alert('充值失败');
    }
  };

  const handleBuy = async (itemId: string, itemType: string, amount: number) => {
    if (!user) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, itemType, amount, userId: user.id })
      });
      if (res.ok) {
        await fetchData();
        alert('购买成功！');
      } else {
        const data = await res.json();
        if (data.error === '余额不足') {
          setIsRechargeModalOpen(true);
        } else {
          alert(data.error || '购买失败');
        }
      }
    } catch (error) {
      alert('购买失败');
    }
  };

  const handleAssignSkill = async (agentId: string, skillName: string) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to assign skill', error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    // If no agent selected, use the first one as default for general help
    const agent = selectedAgent || agents[0];
    if (!agent) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatting(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, message: userMsg })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', content: '抱歉，我现在无法处理您的请求。' }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleExecuteTask = async () => {
    if (!taskAgent || !taskSkill || !taskStudent) return;
    setIsExecutingTask(true);
    setTaskResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentId: taskAgent.id, 
          message: `请使用你的技能【${taskSkill.name}】来帮助学生【${taskStudent.name}】（年级：${taskStudent.grade}，综合评分：${taskStudent.performance_score}）。请给出一个具体的反馈结果。` 
        })
      });
      const data = await res.json();
      setTaskResult(data.reply);
    } catch (error) {
      setTaskResult('任务执行失败，请稍后重试。');
    } finally {
      setIsExecutingTask(false);
    }
  };

  const handlePublishSkill = async () => {
    if (!newSkill.name || !newSkill.description) return;
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill)
      });
      if (res.ok) {
        alert('技能已上线！正在进行云端打包与初始化...');
        setTimeout(async () => {
          await fetchData();
          alert('技能打包完成，已进入市场。');
          setActiveTab('skills');
          setNewSkill({ name: '', category: '语言', description: '', price: 99, icon: '🛠️' });
        }, 2000);
      }
    } catch (error) {
      alert('发布失败');
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} />;
      case 'hire_center': return <HireCenter stats={stats} onBuy={handleBuy} onNavigateToRecharge={() => setActiveTab('recharge')} />;
      case 'agents': return <MyAgents agents={agents} onConfigureSkills={(a) => { setAgentToConfigure(a); setIsSkillModalOpen(true); }} onHireNew={() => setActiveTab('hire_center')} />;
      case 'tasks': return <TaskCenter agents={agents} userSkills={userSkills} students={students} taskAgent={taskAgent} setTaskAgent={setTaskAgent} taskSkill={taskSkill} setTaskSkill={setTaskSkill} taskStudent={taskStudent} setTaskStudent={setTaskStudent} taskResult={taskResult} isExecutingTask={isExecutingTask} onExecute={handleExecuteTask} />;
      case 'students': return <StudentManagement students={students} />;
      case 'skills': return <SkillMarket skills={skills} userSkills={userSkills} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onBuy={handleBuy} />;
      case 'skill_creator': return <SkillCreator newSkill={newSkill} setNewSkill={setNewSkill} onPublish={handlePublishSkill} />;
      case 'models': return <ModelList />;
      case 'recharge': return <Recharge onRecharge={handleRecharge} />;
      case 'knowledge': return <ChatInterface chatInput={chatInput} setChatInput={setChatInput} chatMessages={chatMessages} isChatting={isChatting} onSendMessage={handleSendMessage} />;
      default: return <Dashboard stats={stats} />;
    }
  };

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      dashboard: '数据看板',
      hire_center: '雇佣中心',
      agents: '我的员工',
      tasks: '任务中心',
      students: '学生管理',
      knowledge: '对话',
      skills: '技能市场',
      skill_creator: '技能上线',
      models: '模型列表',
      recharge: '充值'
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-900">{getTabTitle()}</h1>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center text-xs text-slate-400 font-medium">
              <span>主页</span>
              <ChevronRight size={14} className="mx-1" />
              <span className="text-slate-900">{getTabTitle()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="搜索功能或文档..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-slate-800 transition-colors">
                <Plus size={18} />
                <span>快速开始</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isSkillModalOpen && agentToConfigure && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">配置技能 - {agentToConfigure.name}</h3>
                <button onClick={() => setIsSkillModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">已装备技能</h4>
                  <div className="flex flex-wrap gap-2">
                    {agentToConfigure.skills.split(',').filter(Boolean).map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center">
                        {skill}
                        <button className="ml-2 hover:text-red-500"><X size={12} /></button>
                      </span>
                    ))}
                    {agentToConfigure.skills.split(',').filter(Boolean).length === 0 && (
                      <p className="text-xs text-slate-400 italic">尚未装备任何技能</p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">我的技能库</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {userSkills.map(skill => {
                      const isEquipped = agentToConfigure.skills.split(',').includes(skill.name);
                      return (
                        <button
                          key={skill.id}
                          disabled={isEquipped}
                          onClick={() => handleAssignSkill(agentToConfigure.id, skill.name)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isEquipped 
                              ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' 
                              : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{skill.icon}</span>
                            <span className="text-sm font-bold text-slate-900">{skill.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setIsSkillModalOpen(false)}
                  className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  完成配置
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRechargeModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">余额不足</h3>
              <p className="text-slate-500 text-sm mb-8">您的账户余额不足以完成本次购买，请先充值积分。</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setIsRechargeModalOpen(false);
                    setActiveTab('recharge');
                  }}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                >
                  立即去充值
                </button>
                <button 
                  onClick={() => setIsRechargeModalOpen(false)}
                  className="w-full bg-slate-50 text-slate-500 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                >
                  稍后再说
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

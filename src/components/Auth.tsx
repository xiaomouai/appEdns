import React, { useState } from 'react';
import { Bot, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, name: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(email, password, name);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100"
      >
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#E67E5F] rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
              <Bot size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">EasyClaw.work</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isLogin ? '欢迎回来，请登录您的账户' : '开启您的 AI 数字化办公之旅'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">姓名</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="您的真实姓名"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">密码</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-emerald-600 hover:underline">忘记密码?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center space-x-2 group"
            >
              <span>{isLogin ? '立即登录' : '创建账户'}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">或者通过以下方式</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <Github size={18} />
                <span className="text-xs font-medium">GitHub</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <span className="text-xs font-medium">Google</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            {isLogin ? '还没有账户?' : '已经有账户了?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-emerald-600 hover:underline"
            >
              {isLogin ? '立即注册' : '返回登录'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

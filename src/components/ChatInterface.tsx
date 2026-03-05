import React from 'react';
import { Send, Bot } from 'lucide-react';

interface ChatInterfaceProps {
  chatInput: string;
  setChatInput: (input: string) => void;
  chatMessages: any[];
  isChatting: boolean;
  onSendMessage: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatInput,
  setChatInput,
  chatMessages,
  isChatting,
  onSendMessage
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#E67E5F] rounded-xl flex items-center justify-center text-white">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">AI 助手</h3>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">在线 · 随时为你服务</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <Bot size={48} className="text-slate-300" />
            <p className="text-slate-500 max-w-xs">你好！我是你的 AI 助手。你可以问我关于学生管理、技能配置或任何操作上的问题。</p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-700 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isChatting && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="输入你的问题..."
            className="w-full pl-6 pr-16 py-4 bg-white border-none rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-emerald-500"
          />
          <button 
            onClick={onSendMessage}
            disabled={!chatInput || isChatting}
            className="absolute right-2 p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

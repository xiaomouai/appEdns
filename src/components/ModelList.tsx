import React from 'react';
import { Globe } from 'lucide-react';

export const ModelList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">模型列表</h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">当前可用: 12 个模型</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'GPT-4o', provider: 'OpenAI', status: '稳定', latency: '1.2s', type: '多模态' },
          { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: '推荐', latency: '0.8s', type: '逻辑推理' },
          { name: 'Gemini 1.5 Pro', provider: 'Google', status: '稳定', latency: '1.5s', type: '长文本' },
          { name: 'Kimi-V1', provider: 'Moonshot', status: '稳定', latency: '0.9s', type: '中文理解' },
          { name: 'DeepSeek-V2', provider: 'DeepSeek', status: '稳定', latency: '0.5s', type: '高性价比' },
          { name: 'Llama 3 (70B)', provider: 'Meta', status: '开源', latency: '1.1s', type: '通用' },
        ].map((model, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Globe size={20} />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                model.status === '推荐' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
              }`}>
                {model.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-900">{model.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{model.provider}</p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">延迟</p>
                <p className="text-sm font-medium text-slate-700">{model.latency}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">擅长</p>
                <p className="text-sm font-medium text-slate-700">{model.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

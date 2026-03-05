import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface RechargeProps {
  onRecharge: (amount: number) => void;
}

export const Recharge: React.FC<RechargeProps> = ({ onRecharge }) => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">账户充值</h2>
        <p className="text-slate-500 text-sm mb-8">充值积分以解锁更多 AI 员工名额及购买专业技能</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { amount: 99, points: 1000, bonus: '送 50' },
            { amount: 299, points: 3500, bonus: '送 200', popular: true },
            { amount: 999, points: 12000, bonus: '送 1000' },
          ].map((pkg, i) => (
            <div 
              key={i} 
              onClick={() => onRecharge(pkg.amount)}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                pkg.popular 
                  ? 'border-emerald-500 bg-emerald-50/30' 
                  : 'border-slate-100 hover:border-emerald-200 bg-white'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  最受欢迎
                </span>
              )}
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold text-slate-900">¥{pkg.amount}</p>
                <p className="text-sm text-slate-500">{pkg.points} 积分</p>
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">
                  {pkg.bonus}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <CreditCard size={18} className="mr-2 text-slate-400" />
            支付方式
          </h3>
          <div className="flex space-x-4">
            <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center space-x-2 hover:border-emerald-500 transition-colors">
              <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-[10px] font-bold">支</div>
              <span className="text-sm font-medium">支付宝</span>
            </button>
            <button className="flex-1 py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center space-x-2 hover:border-emerald-500 transition-colors">
              <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-white text-[10px] font-bold">微</div>
              <span className="text-sm font-medium">微信支付</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-6 text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={16} />
            <span className="text-xs">安全支付保障</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck size={16} />
            <span className="text-xs">即时到账</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck size={16} />
            <span className="text-xs">开具正规发票</span>
          </div>
        </div>
      </div>
    </div>
  );
};

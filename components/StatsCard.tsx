import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'emerald' | 'rose' | 'amber' | 'blue' | 'indigo' | 'slate' | 'gold' | 'navy';
}

const colorClasses = {
  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
  rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30',
  amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30',
  slate: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
  gold: 'text-gold-light dark:text-gold bg-gold/10 dark:bg-gold/5',
  navy: 'text-navy dark:text-white bg-navy/5 dark:bg-white/5',
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon, 
  trend, 
  color = 'slate' 
}) => {
  return (
    <div className="bg-white dark:bg-[#0f1f35] p-6 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm transition-all hover:shadow-2xl hover:shadow-navy/5 hover:border-gold/30">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[2px]">
            {label}
          </p>
          <h3 className="text-3xl font-black text-navy dark:text-white font-display tracking-tight leading-none mt-2">
            {value}
          </h3>
          {subValue && (
            <p className="text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-wider mt-1.5">
              {subValue}
            </p>
          )}
        </div>
        
        {icon && (
          <div className={`p-4 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-5 flex items-center gap-2">
          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
            trend.isPositive 
              ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' 
              : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
          <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[1.5px]">
            since last month
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;

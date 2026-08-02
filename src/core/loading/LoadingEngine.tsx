import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingEngineProps {
  message?: string;
}

export const LoadingEngine: React.FC<LoadingEngineProps> = ({ 
  message = 'সিস্টেম মডিউল লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
};

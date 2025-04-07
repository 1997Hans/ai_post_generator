'use client';

import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusDisplayProps {
  tone?: string | null;
  approved?: boolean | null;
  className?: string;
  compact?: boolean;
}

export function StatusDisplay({ tone = 'casual', approved = null, className, compact = false }: StatusDisplayProps) {
  if (compact) {
    return (
      <div className={cn('flex flex-col items-end gap-2', className)}>
        <div className="text-sm text-gray-400">{tone}</div>
        <div className="flex items-center bg-gray-800/50 px-3 py-0.5 rounded-full">
          <span className="text-xs font-medium text-gray-300">Pending</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('status-container flex flex-row items-center gap-12', className)}>
      {/* Tone display */}
      <span className="tone-indicator mr-8">{tone}</span>
      
      {/* Status display with clean rectangular badges */}
      <div className="status-row ml-8">
        {approved === null && (
          <div className="bg-[#1e1b2d] border border-[#2d2a3d] rounded-md px-4 py-1.5">
            <span className="text-sm font-medium text-gray-300">Pending</span>
          </div>
        )}
        
        {approved === true && (
          <div className="bg-[#162924] border border-[#1e3731] rounded-md px-4 py-1.5">
            <span className="text-sm font-medium text-green-400">Approved</span>
          </div>
        )}
        
        {approved === false && (
          <div className="bg-[#2d1e1e] border border-[#3d2929] rounded-md px-4 py-1.5">
            <span className="text-sm font-medium text-red-400">Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
} 
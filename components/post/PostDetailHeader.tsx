'use client';

import { useState } from 'react';
import { HelpCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

export function ContextualHelp({ title, content, variant = 'inline' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (variant === 'inline') {
    return (
      <div className="rounded-md bg-violet-700/10 border border-violet-700/20 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-violet-300" />
            <span className="text-sm font-medium text-violet-200">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-violet-300" />
          ) : (
            <ChevronDown className="h-4 w-4 text-violet-300" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-3 pt-0 text-sm text-slate-300 animate-in fade-in duration-150">
            {content}
          </div>
        )}
      </div>
    );
  }
  
  if (variant === 'badge') {
    return (
      <div className="relative group">
        <div className="flex items-center gap-1 cursor-help text-violet-300 hover:text-violet-200 transition-colors">
          {title}
          <HelpCircle className="h-3.5 w-3.5" />
        </div>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-800 border border-slate-700 rounded shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="text-xs text-slate-300">{content}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-800 border-r border-b border-slate-700"></div>
        </div>
      </div>
    );
  }
  
  return null;
}

// Keep a simplified version of ApprovalHelpTooltip for backward compatibility if needed
export function ApprovalHelpTooltip() {
  return (
    <ContextualHelp 
      title="Post Approval Process" 
      content={
        <div className="space-y-2">
          <p>As a Social Media Manager, you have two ways to approve or reject posts:</p>
          <div>
            <span className="font-medium text-white">From the Dashboard:</span>
            <ul className="ml-4 list-disc mt-1 space-y-1">
              <li>Each post card has <span className="text-green-400">Approve</span> and <span className="text-red-400">Reject</span> buttons</li>
              <li>Click these buttons directly to take action without opening the post</li>
            </ul>
          </div>
        </div>
      }
      variant="badge"
    />
  );
} 
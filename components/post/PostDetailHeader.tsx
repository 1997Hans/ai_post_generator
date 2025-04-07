'use client';

import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

export function ApprovalHelpTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-violet-700/20 p-1.5 text-violet-300 hover:bg-violet-700/30 transition-colors"
        aria-label="Help with post approval process"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-slate-800 border border-violet-600/30 shadow-lg z-50 p-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-white">Post Approval Guide</h3>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-300">As a Social Media Manager, you have two ways to approve or reject posts:</p>
              
              <div className="text-xs space-y-2 mt-1">
                <div>
                  <span className="font-medium text-white">From the Dashboard:</span>
                  <ul className="ml-4 mt-1 list-disc text-slate-300">
                    <li>Each post card has <span className="text-green-400">Approve</span> and <span className="text-red-400">Reject</span> buttons</li>
                    <li>Click these buttons directly to take action without opening the post</li>
                  </ul>
                </div>
                
                <div>
                  <span className="font-medium text-white">From Post Details:</span>
                  <ul className="ml-4 mt-1 list-disc text-slate-300">
                    <li>Open any post by clicking the eye icon</li>
                    <li>Use the larger approval buttons at the top right</li>
                    <li>Rejected posts will request feedback to improve future content</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-xs mt-2">
                <span className="font-medium text-white">Status Indicators:</span>
                <ul className="ml-4 mt-1 list-disc">
                  <li><span className="text-amber-500">Pending</span> - Awaiting review</li>
                  <li><span className="text-green-500">Approved</span> - Ready for publishing</li>
                  <li><span className="text-red-500">Rejected</span> - Needs improvements</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs self-end mt-1 text-violet-300 hover:text-violet-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
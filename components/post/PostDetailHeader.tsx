'use client';

import { useState, useEffect, useRef } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function ApprovalHelpTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-violet-700/20 p-2 flex items-center justify-center text-violet-300 hover:bg-violet-700/30 hover:text-violet-200 transition-colors w-9 h-9"
        aria-label="Help with post approval process"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div 
            ref={modalRef}
            className="bg-slate-800 border border-slate-700 rounded-md shadow-xl w-full max-w-md mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-medium text-white">Post Approval Guide</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-slate-300 mb-4">
                Information about the post approval process
              </p>
              
              <div className="bg-slate-900 border border-slate-700 rounded-md p-4 text-sm text-slate-300 mb-2">
                <p className="mb-3">As a Social Media Manager, you have two ways to approve or reject posts:</p>
                
                <div className="mb-2">
                  <span className="font-medium text-white">From the Dashboard:</span>
                  <ul className="ml-4 list-disc mt-1 space-y-1">
                    <li>Each post card has <span className="text-green-400">Approve</span> and <span className="text-red-400">Reject</span> buttons</li>
                    <li>Click these buttons directly to take action without opening the post</li>
                  </ul>
                </div>
                
                <div className="mb-2">
                  <span className="font-medium text-white">From Post Details:</span>
                  <ul className="ml-4 list-disc mt-1 space-y-1">
                    <li>Open any post by clicking the eye icon</li>
                    <li>Use the larger approval buttons at the top right</li>
                    <li>Rejected posts will request feedback to improve future content</li>
                  </ul>
                </div>
                
                <div>
                  <span className="font-medium text-white">Status Indicators:</span>
                  <ul className="ml-4 list-disc mt-1 space-y-1">
                    <li><span className="text-amber-500">Pending</span> - Awaiting review</li>
                    <li><span className="text-green-500">Approved</span> - Ready for publishing</li>
                    <li><span className="text-red-500">Rejected</span> - Needs improvements</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-slate-700">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded bg-slate-700 text-sm text-white hover:bg-slate-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
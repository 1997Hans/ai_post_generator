'use client';

import { useState } from 'react';
import { Copy, Download, Calendar, Share2, Check, Loader2 } from 'lucide-react';
import { Post, SocialPlatform } from '@/lib/types';

interface ExportOptionsProps {
  post: Post;
}

export function ExportOptions({ post }: ExportOptionsProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | ''>('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const handleCopyToClipboard = async () => {
    const content = `${post.content}
    
${post.caption || ''}

${post.hashtags.map(tag => `#${tag}`).join(' ')}`;
    
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };
  
  const handleDownload = () => {
    setIsExporting(true);
    
    // For text download, create a text file
    const content = `${post.content}
    
${post.caption || ''}

${post.hashtags.map(tag => `#${tag}`).join(' ')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `post-${post.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };
  
  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);
    
    // Simulate scheduling with a timeout
    setTimeout(() => {
      setIsScheduling(false);
      alert(`Post scheduled for ${scheduledDate} at ${scheduledTime} on ${selectedPlatform}`);
      setSelectedPlatform('');
      setScheduledDate('');
      setScheduledTime('');
      setIsScheduleFormOpen(false);
    }, 1500);
  };
  
  const handleShareLink = async () => {
    const shareData = {
      title: 'Social Media Post',
      text: post.content,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyToClipboard();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <div className="rounded-xl border bg-card p-6 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-semibold">Export Options</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyToClipboard}
          className="group flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            {isCopied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-primary" />
            )}
          </div>
          <span className="text-sm font-medium">{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
        </button>
        
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="group flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200 disabled:opacity-50 disabled:hover:bg-background disabled:hover:border-input"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            {isExporting ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Download className="h-5 w-5 text-primary" />
            )}
          </div>
          <span className="text-sm font-medium">Download</span>
        </button>
        
        <button
          onClick={handleShareLink}
          className="group flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium">Share Link</span>
        </button>
        
        <button
          onClick={() => setIsScheduleFormOpen(!isScheduleFormOpen)}
          className="group flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium">Schedule Post</span>
        </button>
      </div>
      
      <div 
        className={`space-y-4 border-t pt-4 mt-4 overflow-hidden transition-all duration-300 ${
          isScheduleFormOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <form onSubmit={handleSchedule}>
          <div className="space-y-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium mb-1">
                Platform
              </label>
              <select
                id="platform"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                required
              >
                <option value="">Select a platform</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isScheduling || !selectedPlatform || !scheduledDate || !scheduledTime}
              className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isScheduling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              Schedule Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
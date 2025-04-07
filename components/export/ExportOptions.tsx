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
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <h3 className="text-lg font-medium">Export Options</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopyToClipboard}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          {isCopied ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
          <span className="text-sm">{isCopied ? 'Copied!' : 'Copy to Clipboard'}</span>
        </button>
        
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          <span className="text-sm">Download</span>
        </button>
        
        <button
          onClick={handleShareLink}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm">Share Link</span>
        </button>
        
        <button
          onClick={() => document.getElementById('schedule-form')?.classList.toggle('hidden')}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Schedule Post</span>
        </button>
      </div>
      
      <form 
        id="schedule-form" 
        onSubmit={handleSchedule} 
        className="hidden space-y-4 border-t pt-4 mt-4"
      >
        <div>
          <label htmlFor="platform" className="block text-sm font-medium mb-1">
            Platform
          </label>
          <select
            id="platform"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
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
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
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
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isScheduling || !selectedPlatform || !scheduledDate || !scheduledTime}
          className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isScheduling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="h-4 w-4" />
          )}
          Schedule Post
        </button>
      </form>
    </div>
  );
} 
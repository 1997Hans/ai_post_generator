'use client';

import { useEffect, useState } from 'react';

export function MaintenanceHandler() {
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');

  useEffect(() => {
    // Run maintenance once on mount
    const runMaintenance = async () => {
      try {
        setStatus('running');
        
        // Call the maintenance API
        const response = await fetch('/api/maintenance');
        const data = await response.json();
        
        if (data.success) {
          console.log('Maintenance completed:', data);
          setStatus('complete');
        } else {
          console.error('Maintenance failed:', data.error);
          setStatus('error');
        }
      } catch (error) {
        console.error('Error running maintenance:', error);
        setStatus('error');
      }
    };

    runMaintenance();
  }, []);

  // No visible UI - this component just handles the maintenance logic
  return null;
} 
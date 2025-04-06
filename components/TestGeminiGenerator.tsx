'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export function TestGeminiGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('friendly');
  const [platform, setPlatform] = useState('instagram');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      topic,
      tone,
      platform
    },
    onResponse: (response) => {
      // Optional: Do something with the response
      console.log('Response received', response);
    },
  });
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    handleSubmit(e);
  };
  
  // Tone options
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'informative', label: 'Informative' },
    { value: 'casual', label: 'Casual' },
  ];
  
  // Platform options
  const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Generate Social Media Post</h2>
      
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Post Topic <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic (e.g., Sinulog Festival)"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tone
          </label>
          <select 
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {toneOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Platform
          </label>
          <select 
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {platformOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !topic}
          className={`w-full p-3 rounded-md font-medium text-white ${
            isLoading || !topic ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Post'}
        </button>
      </form>
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error.message || 'An error occurred during generation.'}
        </div>
      )}
      
      {/* Results Display */}
      {messages.length > 1 && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md">
          <h3 className="font-semibold mb-2">Generated Post</h3>
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
            {messages[messages.length - 1].content}
          </pre>
        </div>
      )}
    </div>
  );
} 
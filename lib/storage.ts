import { Post, PostHistory } from './types';

const HISTORY_KEY = 'post-generator-history';

export function savePost(post: Post): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot save post on server side');
    return;
  }

  try {
    // Get current posts
    const history = getPostHistory();
    
    // Check if post already exists
    const existingIndex = history.posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      // Update existing post
      history.posts[existingIndex] = {
        ...post,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new post
      history.posts.unshift(post);
    }
    
    // Keep only the last 50 posts
    if (history.posts.length > 50) {
      history.posts = history.posts.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    console.log('Post saved successfully:', post.id);
    console.log('Current post count:', history.posts.length);
    
    // Dispatch storage event to notify other components of the change
    window.dispatchEvent(new Event('storage'));
    
    // Also dispatch a custom event
    const customEvent = new CustomEvent('postUpdated', { detail: { postId: post.id } });
    window.dispatchEvent(customEvent);
  } catch (error) {
    console.error('Failed to save post:', error);
  }
}

export function getPostHistory(): PostHistory {
  if (typeof window === 'undefined') {
    return { posts: [] };
  }
  
  try {
    const historyString = localStorage.getItem(HISTORY_KEY);
    if (!historyString) {
      return { posts: [] };
    }
    
    const parsed = JSON.parse(historyString) as PostHistory;
    return parsed;
  } catch (e) {
    console.error('Failed to parse post history:', e);
    return { posts: [] };
  }
}

export function getPostById(id: string): Post | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  try {
    const history = getPostHistory();
    return history.posts.find(post => post.id === id);
  } catch (error) {
    console.error('Failed to get post by ID:', error);
    return undefined;
  }
}

export function deletePost(id: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const history = getPostHistory();
    history.posts = history.posts.filter(post => post.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    // Dispatch storage event to notify other components of the change
    window.dispatchEvent(new Event('storage'));
    
    // Also dispatch a custom event
    const customEvent = new CustomEvent('postUpdated', { detail: { postId: id, deleted: true } });
    window.dispatchEvent(customEvent);
  } catch (error) {
    console.error('Failed to delete post:', error);
  }
}

export function saveFeedback(postId: string, rating: number, comment?: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const post = getPostById(postId);
    if (!post) return;
    
    const feedbackStorage = localStorage.getItem('post-generator-feedback') || '{}';
    let feedback;
    
    try {
      feedback = JSON.parse(feedbackStorage);
    } catch (e) {
      feedback = {};
    }
    
    feedback[postId] = {
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('post-generator-feedback', JSON.stringify(feedback));
  } catch (error) {
    console.error('Failed to save feedback:', error);
  }
} 
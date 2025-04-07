import { Post, PostHistory } from './types';

const HISTORY_KEY = 'post-generator-history';

export function savePost(post: Post): void {
  if (typeof window === 'undefined') {
    console.warn('Cannot save post on server side');
    return;
  }

  try {
    // Make sure the post has all required fields
    if (!post.id) {
      console.error('Cannot save post without an ID');
      return;
    }
    
    if (!post.content) {
      console.error('Cannot save post without content');
      return;
    }

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
      console.log(`Updated existing post with ID: ${post.id}`);
    } else {
      // Add new post at the beginning of the array
      history.posts.unshift({
        ...post,
        createdAt: post.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : []
      });
      console.log(`Added new post with ID: ${post.id}`);
    }
    
    // Keep only the last 50 posts
    if (history.posts.length > 50) {
      history.posts = history.posts.slice(0, 50);
    }
    
    // Save to localStorage
    const serialized = JSON.stringify(history);
    localStorage.setItem(HISTORY_KEY, serialized);
    console.log('Post saved successfully:', post.id);
    console.log('Current post count:', history.posts.length);
    
    // Force localStorage update
    try {
      // Check if the save was successful by reading it back
      const savedData = localStorage.getItem(HISTORY_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const foundPost = parsed.posts.find((p: Post) => p.id === post.id);
        if (foundPost) {
          console.log('Verified post was saved correctly');
        } else {
          console.error('Post was not saved correctly! Will retry...');
          // Try one more time
          localStorage.setItem(HISTORY_KEY, serialized);
        }
      }
    } catch (verifyError) {
      console.error('Error verifying post save:', verifyError);
    }
    
    // Dispatch storage event to notify other components of the change
    window.dispatchEvent(new Event('storage'));
    
    // Also dispatch a custom event
    const customEvent = new CustomEvent('postUpdated', { 
      detail: { postId: post.id, action: 'save' } 
    });
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
      console.log('No post history found in localStorage');
      return { posts: [] };
    }
    
    try {
      const parsed = JSON.parse(historyString) as PostHistory;
      
      // Validate structure
      if (!parsed.posts || !Array.isArray(parsed.posts)) {
        console.error('Invalid post history structure');
        return { posts: [] };
      }
      
      // Filter out any invalid posts and ensure required fields
      const validPosts = parsed.posts.filter(post => {
        return post && typeof post === 'object' && post.id && post.content;
      });
      
      console.log(`Found ${validPosts.length} valid posts in localStorage`);
      
      // Return valid posts
      return { posts: validPosts };
    } catch (e) {
      console.error('Failed to parse post history:', e);
      return { posts: [] };
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return { posts: [] };
  }
}

export function getPostById(id: string): Post | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  try {
    const history = getPostHistory();
    const post = history.posts.find(post => post.id === id);
    
    if (post) {
      console.log(`Found post with ID: ${id}`);
      return post;
    } else {
      console.log(`No post found with ID: ${id}`);
      return undefined;
    }
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
    const initialCount = history.posts.length;
    history.posts = history.posts.filter(post => post.id !== id);
    const finalCount = history.posts.length;
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    console.log(`Deleted post with ID: ${id}`);
    console.log(`Posts before: ${initialCount}, after: ${finalCount}`);
    
    // Dispatch storage event to notify other components of the change
    window.dispatchEvent(new Event('storage'));
    
    // Also dispatch a custom event
    const customEvent = new CustomEvent('postUpdated', { 
      detail: { postId: id, action: 'delete' } 
    });
    window.dispatchEvent(customEvent);
  } catch (error) {
    console.error('Failed to delete post:', error);
  }
}

export function clearAllPosts(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ posts: [] }));
    console.log('Cleared all posts from storage');
    
    // Dispatch events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('postUpdated', { 
      detail: { action: 'clear' } 
    }));
  } catch (error) {
    console.error('Failed to clear posts:', error);
  }
}

// Debug function to inspect localStorage content
export function debugStorage(): void {
  if (typeof window === 'undefined') {
    console.log('Cannot debug storage on server side');
    return;
  }
  
  try {
    const historyString = localStorage.getItem(HISTORY_KEY);
    console.log('Raw localStorage content:', historyString);
    
    if (historyString) {
      try {
        const parsed = JSON.parse(historyString);
        console.log('Parsed storage content:', parsed);
        
        if (parsed.posts && Array.isArray(parsed.posts)) {
          console.log(`Post count: ${parsed.posts.length}`);
          if (parsed.posts.length > 0) {
            console.log('First post:', parsed.posts[0]);
          }
        } else {
          console.error('Invalid posts structure in storage');
        }
      } catch (e) {
        console.error('Failed to parse storage content:', e);
      }
    } else {
      console.log('No post history in localStorage');
    }
  } catch (error) {
    console.error('Error debugging storage:', error);
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
    console.log(`Saved feedback for post: ${postId}`);
  } catch (error) {
    console.error('Failed to save feedback:', error);
  }
} 
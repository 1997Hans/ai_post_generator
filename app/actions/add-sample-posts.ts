'use server'

import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'

// Sample posts to add to the database
const samplePosts = [
  {
    content: `Exciting News: Our Summer Collection Launch! 🌞

We're thrilled to announce our vibrant new summer collection is now live! From breezy cotton tees to stylish sustainable swimwear, we've got everything you need for the perfect summer wardrobe.`,
    image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&h=600&auto=format&fit=crop',
    hashtags: 'SummerCollection,SustainableFashion,NewArrivals,SummerStyle',
    prompt: 'Summer fashion collection launch post',
    refined_prompt: 'Create an engaging social media post announcing our new summer fashion collection with a focus on sustainability',
    tone: 'professional',
    visual_style: 'bright',
    approved: true
  },
  {
    content: `Friday Motivation: You don't have to be perfect to be amazing! 💪

Remember that progress isn't always linear, and that's perfectly okay. Every small step you take is still moving you forward. What small win are you celebrating today?`,
    image_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&h=600&auto=format&fit=crop',
    hashtags: 'FridayMotivation,Inspiration,ProgressNotPerfection,SelfCare',
    prompt: 'Motivational post for Friday',
    refined_prompt: 'Create an inspiring motivational post for Friday that encourages progress over perfection',
    tone: 'inspirational',
    visual_style: 'minimal',
    approved: false
  },
  {
    content: `Tech Tip Tuesday: Maximize Your Productivity 💻

Did you know that taking regular short breaks actually improves your focus? The Pomodoro Technique suggests working for 25 minutes, then taking a 5-minute break. Try it today and let us know how it works for you!`,
    image_url: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&h=600&auto=format&fit=crop',
    hashtags: 'TechTipTuesday,Productivity,WorkSmarter,PomodoroTechnique',
    prompt: 'Tech productivity tip post',
    refined_prompt: 'Create a helpful tech productivity tip post about the Pomodoro Technique',
    tone: 'informative',
    visual_style: 'professional',
    approved: true
  }
];

/**
 * Adds sample posts to the database if there are no posts
 */
export async function addSamplePosts() {
  try {
    // First check if there are any posts
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw new Error(countError.message);
    
    // If we already have posts, don't add more
    if (count && count > 0) {
      console.log(`Database already has ${count} posts, not adding samples`);
      return { success: true, added: 0, message: 'Posts already exist' };
    }
    
    console.log('No posts found, adding sample posts...');
    
    // Add all sample posts
    let addedCount = 0;
    for (const post of samplePosts) {
      const { error } = await supabase.from('posts').insert({
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...post
      });
      
      if (error) {
        console.error('Error adding sample post:', error);
      } else {
        addedCount++;
      }
    }
    
    // Revalidate paths to show the new posts
    revalidatePath('/');
    revalidatePath('/dashboard');
    
    console.log(`Successfully added ${addedCount} sample posts`);
    
    return { success: true, added: addedCount };
  } catch (error) {
    console.error('Error adding sample posts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 
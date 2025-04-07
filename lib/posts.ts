// Re-export types and functions needed for the dashboard
import type { Post } from '../lib/types';
import { getAllPosts as getPostsFromDB } from '@/app/actions/db-actions';

export type { Post };

export async function getAllPosts(): Promise<Post[]> {
  return getPostsFromDB();
} 
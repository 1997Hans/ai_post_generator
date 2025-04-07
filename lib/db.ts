import { supabase } from './supabase';

export const db = supabase;

// Helper functions for interacting with the database
export async function queryDb(
  table: string, 
  query: any = {}, 
  options: any = {}
) {
  try {
    let request = db.from(table).select(options.select || '*');

    if (query.filters) {
      for (const filter of query.filters) {
        request = request.filter(filter.column, filter.operator, filter.value);
      }
    }

    if (query.eq) {
      for (const [column, value] of Object.entries(query.eq)) {
        request = request.eq(column, value);
      }
    }

    if (query.order) {
      request = request.order(query.order.column, { ascending: query.order.ascending });
    }

    if (query.limit) {
      request = request.limit(query.limit);
    }

    return await request;
  } catch (error) {
    console.error('Database query error:', error);
    return { data: null, error };
  }
} 
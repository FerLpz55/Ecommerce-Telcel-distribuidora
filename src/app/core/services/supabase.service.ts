import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Provide a dummy URL if missing to avoid crashes during build/prerender
    const supabaseUrl = environment.supabaseUrl && environment.supabaseUrl.startsWith('http') 
      ? environment.supabaseUrl 
      : 'https://placeholder-supabase.co';
    const supabaseKey = environment.supabaseKey || 'placeholder-key';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
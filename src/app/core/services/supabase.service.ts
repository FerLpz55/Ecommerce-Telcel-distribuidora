import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private static readonly FALLBACK_SUPABASE_URL = 'https://qqrllytqukyamfmxoszi.supabase.co';
  private static readonly FALLBACK_SUPABASE_KEY = 'sb_publishable_15onMwU5wvaJvz_2oGRdqw_UVXV87Q1';
  private supabase: SupabaseClient;

  constructor() {
    const configuredUrl = (environment.supabaseUrl ?? '').trim();
    const configuredKey = (environment.supabaseKey ?? '').trim();
    const supabaseUrl =
      configuredUrl && configuredUrl.startsWith('http')
        ? configuredUrl
        : SupabaseService.FALLBACK_SUPABASE_URL;
    const supabaseKey = configuredKey || SupabaseService.FALLBACK_SUPABASE_KEY;

    if (!configuredUrl || !configuredKey) {
      console.warn('Supabase env incompleto en build/runtime. Usando fallback interno.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}

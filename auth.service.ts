import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthChangeEvent, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private _session$ = new BehaviorSubject<Session | null>(null);

  // Observable para que los componentes se suscriban a los cambios de sesión
  session$: Observable<Session | null> = this._session$.asObservable();

  constructor(private supabaseService: SupabaseService) {
    // 1. Inicializar el cliente de Supabase aquí para evitar errores
    this.supabase = this.supabaseService.getClient();

    // 2. Cargar la sesión inicial al arrancar el servicio
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this._session$.next(session);
    });

    // 3. Escuchar cambios en el estado de autenticación y actualizar el BehaviorSubject
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._session$.next(session);
    });
  }

  // Inicia sesión con email y password
  async login(credentials: { email: string, password: string }) {
    return this.supabase.auth.signInWithPassword(credentials);
  }

  // Registrar un nuevo usuario
  async signUp(credentials: { email: string, password: string }) {
    return this.supabase.auth.signUp(credentials);
  }

  // Cierra la sesión del usuario
  async logout() {
    return this.supabase.auth.signOut();
  }

  // Obtiene el token de la sesión actual para el interceptor
  async getToken(): Promise<string | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  // Un método útil para saber si el usuario está logueado (sincrónico)
  isLoggedIn(): boolean {
    return !!this._session$.getValue();
  }

  // Obtener el usuario actual de forma síncrona
  get currentUser(): User | undefined {
    return this._session$.getValue()?.user;
  }
}
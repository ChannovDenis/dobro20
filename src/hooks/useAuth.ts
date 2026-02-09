import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/feed`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const getAuthErrorMessage = useCallback((error: AuthError): string => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Неверный email или пароль';
      case 'Email not confirmed':
        return 'Подтвердите email для входа';
      case 'User already registered':
        return 'Пользователь с таким email уже существует';
      case 'Password should be at least 6 characters':
        return 'Пароль должен содержать минимум 6 символов';
      case 'Unable to validate email address: invalid format':
        return 'Неверный формат email';
      default:
        if (error.message.includes('rate limit')) {
          return 'Слишком много попыток. Попробуйте позже';
        }
        return error.message || 'Произошла ошибка';
    }
  }, []);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    getAuthErrorMessage,
  };
}

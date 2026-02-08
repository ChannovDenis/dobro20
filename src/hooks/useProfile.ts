import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from './useTenant';

export interface Profile {
  id: string;
  user_id: string;
  tenant_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  subscription_tier: string;
  ai_messages_used: number;
  expert_minutes_used: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { tenantId, quotas } = useTenant();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user's profile
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        // Profile doesn't exist, create one
        if (fetchError.code === 'PGRST116') {
          const newProfile = await createProfile(user.id);
          setProfile(newProfile);
          return;
        }
        throw fetchError;
      }

      setProfile(data as Profile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Не удалось загрузить профиль');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new profile for user
  const createProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          tenant_id: tenantId,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return data as Profile;
    } catch (err) {
      console.error('Failed to create profile:', err);
      return null;
    }
  };

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<Pick<Profile, 'display_name' | 'avatar_url'>>) => {
    if (!profile) return;

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data as Profile);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Не удалось обновить профиль');
    }
  }, [profile]);

  // Increment AI messages used
  const incrementAiMessagesUsed = useCallback(async () => {
    if (!profile) return;

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ ai_messages_used: profile.ai_messages_used + 1 })
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data as Profile);
    } catch (err) {
      console.error('Failed to increment AI messages:', err);
    }
  }, [profile]);

  // Check if user has remaining AI quota
  const hasAiQuota = useCallback((): boolean => {
    if (!profile) return true; // Allow for anonymous users
    return profile.ai_messages_used < quotas.free_ai_messages;
  }, [profile, quotas]);

  // Check if user has remaining expert quota
  const hasExpertQuota = useCallback((): boolean => {
    if (!profile) return false;
    return profile.expert_minutes_used < quotas.free_expert_minutes;
  }, [profile, quotas]);

  // Get remaining quotas
  const getRemainingQuotas = useCallback(() => {
    if (!profile) {
      return {
        aiMessages: quotas.free_ai_messages,
        expertMinutes: quotas.free_expert_minutes,
      };
    }
    return {
      aiMessages: Math.max(0, quotas.free_ai_messages - profile.ai_messages_used),
      expertMinutes: Math.max(0, quotas.free_expert_minutes - profile.expert_minutes_used),
    };
  }, [profile, quotas]);

  // Listen for auth changes
  useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    incrementAiMessagesUsed,
    hasAiQuota,
    hasExpertQuota,
    getRemainingQuotas,
    fetchProfile,
  };
}

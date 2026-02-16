import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from './useTenant';

export type TopicStatus = 'active' | 'archived' | 'escalated';
export type MessageRole = 'user' | 'assistant' | 'system' | 'expert';

export interface Topic {
  id: string;
  user_id: string | null;
  tenant_id: string | null;
  title: string;
  service_type: string | null;
  context: Record<string, unknown> | null;
  status: TopicStatus;
  created_at: string;
  updated_at: string;
}

export interface TopicMessage {
  id: string;
  topic_id: string;
  role: MessageRole;
  content: string;
  metadata: Record<string, unknown> | null;
  tokens_used: number;
  created_at: string;
}

interface UseTopicsOptions {
  autoLoad?: boolean;
}

export function useTopics(options: UseTopicsOptions = { autoLoad: true }) {
  const { tenantId } = useTenant();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<TopicMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all topics for current user
  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('topics')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTopics((data || []) as Topic[]);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      setError('Не удалось загрузить чаты');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch messages for a specific topic
  const fetchMessages = useCallback(async (topicId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('topic_messages')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMessages((data || []) as TopicMessage[]);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Не удалось загрузить сообщения');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new topic
  const createTopic = useCallback(async (
    title?: string,
    serviceType?: string,
    context?: Record<string, unknown>
  ): Promise<Topic | null> => {
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const insertData: {
        user_id: string | null;
        tenant_id: string | null;
        title: string;
        service_type: string | null;
        context: Record<string, unknown> | null;
        status: 'active' | 'archived' | 'escalated';
      } = {
        user_id: user?.id ?? null,
        tenant_id: tenantId ?? null,
        title: title || 'Новый чат',
        service_type: serviceType ?? null,
        context: context ?? null,
        status: 'active',
      };

      const { data, error: insertError } = await supabase
        .from('topics')
        .insert(insertData as never)
        .select()
        .single();

      if (insertError) throw insertError;

      const topic = data as Topic;
      setTopics(prev => [topic, ...prev]);
      setCurrentTopic(topic);
      setMessages([]);
      
      return topic;
    } catch (err) {
      console.error('Failed to create topic:', err);
      setError('Не удалось создать чат');
      return null;
    }
  }, [tenantId]);

  // Add a message to current topic
  const addMessage = useCallback(async (
    role: MessageRole,
    content: string,
    metadata?: Record<string, unknown>,
    tokensUsed?: number
  ): Promise<TopicMessage | null> => {
    if (!currentTopic) {
      setError('Нет активного чата');
      return null;
    }

    try {
      const insertData: {
        topic_id: string;
        role: 'user' | 'assistant' | 'system' | 'expert';
        content: string;
        metadata: Record<string, unknown> | null;
        tokens_used: number;
      } = {
        topic_id: currentTopic.id,
        role: role as 'user' | 'assistant' | 'system' | 'expert',
        content,
        metadata: metadata ?? null,
        tokens_used: tokensUsed ?? 0,
      };

      const { data, error: insertError } = await supabase
        .from('topic_messages')
        .insert(insertData as never)
        .select()
        .single();

      if (insertError) throw insertError;

      const message = data as TopicMessage;
      setMessages(prev => [...prev, message]);

      // Update topic's updated_at
      await supabase
        .from('topics')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentTopic.id);

      return message;
    } catch (err) {
      console.error('Failed to add message:', err);
      setError('Не удалось отправить сообщение');
      return null;
    }
  }, [currentTopic]);

  // Update topic title
  const updateTopicTitle = useCallback(async (topicId: string, title: string) => {
    try {
      const { error: updateError } = await supabase
        .from('topics')
        .update({ title })
        .eq('id', topicId);

      if (updateError) throw updateError;

      setTopics(prev => prev.map(t => 
        t.id === topicId ? { ...t, title } : t
      ));

      if (currentTopic?.id === topicId) {
        setCurrentTopic(prev => prev ? { ...prev, title } : null);
      }
    } catch (err) {
      console.error('Failed to update topic title:', err);
    }
  }, [currentTopic]);

  // Update topic status
  const updateTopicStatus = useCallback(async (topicId: string, status: TopicStatus) => {
    try {
      const { error: updateError } = await supabase
        .from('topics')
        .update({ status })
        .eq('id', topicId);

      if (updateError) throw updateError;

      setTopics(prev => prev.map(t => 
        t.id === topicId ? { ...t, status } : t
      ));

      if (currentTopic?.id === topicId) {
        setCurrentTopic(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Failed to update topic status:', err);
    }
  }, [currentTopic]);

  // Delete a topic
  const deleteTopic = useCallback(async (topicId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);

      if (deleteError) throw deleteError;

      setTopics(prev => prev.filter(t => t.id !== topicId));

      if (currentTopic?.id === topicId) {
        setCurrentTopic(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete topic:', err);
      setError('Не удалось удалить чат');
    }
  }, [currentTopic]);

  // Select a topic and load its messages
  const selectTopic = useCallback(async (topic: Topic) => {
    setCurrentTopic(topic);
    await fetchMessages(topic.id);
  }, [fetchMessages]);

  // Auto-generate title from first message
  const autoGenerateTitle = useCallback(async (topicId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    await updateTopicTitle(topicId, title);
  }, [updateTopicTitle]);

  // Auto-load topics on mount
  useEffect(() => {
    if (options.autoLoad) {
      fetchTopics();
    }
  }, [options.autoLoad, fetchTopics]);

  return {
    // State
    topics,
    currentTopic,
    messages,
    isLoading,
    error,

    // Actions
    fetchTopics,
    fetchMessages,
    createTopic,
    addMessage,
    updateTopicTitle,
    updateTopicStatus,
    deleteTopic,
    selectTopic,
    autoGenerateTitle,
    setCurrentTopic,
    setMessages,
  };
}

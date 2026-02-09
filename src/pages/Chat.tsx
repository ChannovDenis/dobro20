import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestionTicker } from "@/components/chat/SuggestionTicker";
import { TopicContextBar } from "@/components/chat/TopicContextBar";
import { ExpertButton } from "@/components/chat/ExpertButton";
import { DeleteTopicDialog } from "@/components/chat/DeleteTopicDialog";
import { ClearMessagesDialog } from "@/components/chat/ClearMessagesDialog";
import { RenameTopicDialog } from "@/components/chat/RenameTopicDialog";
import { useChat } from "@/hooks/useChat";
import { useTopics, Topic } from "@/hooks/useTopics";
import { ChatAction } from "@/types/chat";
import { useTenant } from "@/hooks/useTenant";
import { getAssistant } from "@/constants/aiAssistants";
import { toast } from "sonner";

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tenant } = useTenant();
  
  // Read context and service from URL params
  const contextParam = searchParams.get("context");
  const promptParam = searchParams.get("prompt");
  const serviceParam = searchParams.get("service");
  const topicIdParam = searchParams.get("topicId");
  const [context, setContext] = useState<string | null>(contextParam);
  
  // Topics hook for DB integration
  const { 
    currentTopic, 
    messages: topicMessages, 
    setCurrentTopic,
    selectTopic,
    fetchTopics,
    topics,
    updateTopicTitle,
    updateTopicStatus,
    clearMessages: clearTopicMessages,
    deleteTopic,
  } = useTopics({ autoLoad: true });
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  
  // Handler for auto-created topic
  const handleTopicAutoCreated = useCallback((newTopicId: string, newServiceType: string) => {
    // Update URL with new topic
    setSearchParams({ topicId: newTopicId, service: newServiceType });
    // Refresh topics list
    fetchTopics();
  }, [setSearchParams, fetchTopics]);

  // Get the appropriate AI assistant based on service
  const currentService = currentTopic?.service_type || serviceParam;
  const assistant = getAssistant(currentService);
  const AssistantIcon = assistant.icon;
  
  const {
    messages,
    isLoading,
    isStyleMode,
    uploadedPhoto,
    sendMessage,
    handleAction,
    handleImageUpload,
    clearUploadedPhoto,
    setServiceType,
    setTopicId,
  } = useChat(handleTopicAutoCreated);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load topic from URL param on mount
  useEffect(() => {
    if (topicIdParam && topics.length > 0) {
      const topic = topics.find(t => t.id === topicIdParam);
      if (topic) {
        selectTopic(topic);
      }
    }
  }, [topicIdParam, topics, selectTopic]);

  // Sync service type to chat hook
  useEffect(() => {
    if (currentService && setServiceType) {
      setServiceType(currentService);
    }
  }, [currentService, setServiceType]);

  // Sync topic ID to chat hook - use URL param directly for immediate loading
  useEffect(() => {
    const targetTopicId = currentTopic?.id || topicIdParam;
    if (targetTopicId && setTopicId) {
      setTopicId(targetTopicId);
    }
  }, [currentTopic?.id, topicIdParam, setTopicId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleActionClick = (action: string) => {
    handleAction(action as ChatAction);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  const handleTopicCreated = (topicId: string, serviceType: string) => {
    // Update URL with new topic
    setSearchParams({ topicId, service: serviceType });
    // Refresh topics list
    fetchTopics();
  };

  const hasMessages = messages.length > 0;

  const handleClose = () => {
    setSearchParams({});
    navigate('/feed');
  };

  const clearContext = () => {
    setContext(null);
    setSearchParams({});
  };

  // Topic action handlers
  const handleRename = async (newTitle: string) => {
    if (currentTopic) {
      await updateTopicTitle(currentTopic.id, newTitle);
      toast.success("Чат переименован");
    }
  };

  const handleClearMessages = async () => {
    if (currentTopic) {
      const success = await clearTopicMessages(currentTopic.id);
      if (success) {
        toast.success("Сообщения очищены");
      }
    }
  };

  const handleArchive = async () => {
    if (currentTopic) {
      const newStatus = currentTopic.status === 'archived' ? 'active' : 'archived';
      await updateTopicStatus(currentTopic.id, newStatus);
      toast.success(newStatus === 'archived' ? "Чат в архиве" : "Чат восстановлен");
    }
  };

  const handleDelete = async () => {
    if (currentTopic) {
      const success = await deleteTopic(currentTopic.id);
      if (success) {
        toast.success("Чат удалён");
        navigate('/feed');
      }
    }
  };

  // Get AI name: service-specific > style mode > tenant config > default
  const aiName = isStyleMode 
    ? "Стилист Лиза" 
    : (currentService ? assistant.name : (tenant?.ai_name || "Добро-ассистент"));

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Modal Header with close button and expert button */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 safe-top border-b border-border/30"
      >
        <button
          type="button"
          onClick={handleClose}
          className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <AssistantIcon 
            className="w-5 h-5" 
            style={{ color: `hsl(${assistant.color})` }} 
          />
          <h1 className="text-base font-medium text-foreground">
            {aiName}
          </h1>
        </div>
        {/* Expert button */}
        <ExpertButton serviceId={currentService} />
      </motion.header>

      {/* Topic context bar */}
      {currentTopic && (
        <TopicContextBar 
          topic={currentTopic} 
          messageCount={messages.length}
          onRename={() => setRenameDialogOpen(true)}
          onClearMessages={() => setClearDialogOpen(true)}
          onArchive={handleArchive}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      )}

      {/* Dialogs */}
      <DeleteTopicDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        topicTitle={currentTopic?.title || ""}
        onConfirm={handleDelete}
      />
      <ClearMessagesDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        onConfirm={handleClearMessages}
      />
      <RenameTopicDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentTitle={currentTopic?.title || ""}
        onConfirm={handleRename}
      />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col">
        {/* Context badge */}
        {context && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-2 glass rounded-xl text-sm">
              <span className="text-muted-foreground">Контекст:</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{context}</span>
              <button
                onClick={clearContext}
                className="p-0.5 rounded-full hover:bg-secondary/50 text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center px-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `linear-gradient(135deg, hsl(${assistant.color}), hsl(${assistant.color} / 0.7))` }}
              >
                <AssistantIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-muted-foreground text-sm">
                {currentTopic ? `Тема: ${currentTopic.title}` : "Чем могу помочь?"}
              </p>
            </motion.div>

            {/* Suggestion ticker - service-specific or default */}
            <SuggestionTicker 
              onSuggestionClick={handleSuggestionClick} 
              serviceId={currentService || undefined}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onAction={handleActionClick}
              />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, hsl(${assistant.color}), hsl(${assistant.color} / 0.7))` }}
                >
                  <AssistantIcon className="w-4 h-4 text-white" />
                </div>
                <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        onImageSelect={handleImageUpload}
        uploadedPhotoUrl={uploadedPhoto?.url}
        onClearPhoto={clearUploadedPhoto}
        initialPrompt={promptParam || undefined}
        onTopicCreated={handleTopicCreated}
      />
    </div>
  );
}

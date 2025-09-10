import { useChat as useChatContext } from '../context/ChatContext';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { format, isToday, isYesterday } from 'date-fns';

export function useChat() {
  // Re-export the context hook for consistency
  return useChatContext();
}

export function useConversationsList() {
  const { conversations, activeConversationId } = useChatContext();

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      // Pin active conversation to top
      if (a.id === activeConversationId) return -1;
      if (b.id === activeConversationId) return 1;
      
      // Sort by last message time
      const aLastMessage = a.messages[a.messages.length - 1];
      const bLastMessage = b.messages[b.messages.length - 1];
      
      if (!aLastMessage) return 1;
      if (!bLastMessage) return -1;
      
      return new Date(bLastMessage.timestamp) - new Date(aLastMessage.timestamp);
    });
  }, [conversations, activeConversationId]);

  const groupedConversations = useMemo(() => {
    const groups = {
      care: [],
      community: [],
      ai: []
    };

    sortedConversations.forEach(conversation => {
      if (groups[conversation.type]) {
        groups[conversation.type].push(conversation);
      }
    });

    return groups;
  }, [sortedConversations]);

  return {
    conversations: sortedConversations,
    groupedConversations,
    totalConversations: conversations.length
  };
}

export function useMessageFormatting() {
  const formatMessageTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  }, []);

  const formatMessageDate = useCallback((timestamp) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  }, []);

  const groupMessagesByDate = useCallback((messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = formatMessageDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  }, [formatMessageDate]);

  const shouldShowTimestamp = useCallback((currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const current = new Date(currentMessage.timestamp);
    const previous = new Date(previousMessage.timestamp);
    
    // Show timestamp if messages are more than 5 minutes apart
    const timeDiff = (current - previous) / (1000 * 60);
    return timeDiff > 5;
  }, []);

  return {
    formatMessageTime,
    formatMessageDate,
    groupMessagesByDate,
    shouldShowTimestamp
  };
}

export function useChatSearch(query = '', filters = {}) {
  const { conversations } = useChatContext();

  const searchResults = useMemo(() => {
    if (!query.trim() && Object.keys(filters).length === 0) {
      return [];
    }

    const results = [];
    const searchTerm = query.toLowerCase();

    conversations.forEach(conversation => {
      // Filter by conversation type
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(conversation.type)) {
          return;
        }
      }

      // Search within messages
      conversation.messages.forEach(message => {
        if (message.content.toLowerCase().includes(searchTerm)) {
          results.push({
            conversationId: conversation.id,
            conversationTitle: conversation.title,
            conversationType: conversation.type,
            message,
            snippet: getMessageSnippet(message.content, searchTerm)
          });
        }
      });
    });

    return results.sort((a, b) => 
      new Date(b.message.timestamp) - new Date(a.message.timestamp)
    );
  }, [conversations, query, filters]);

  const getMessageSnippet = useCallback((content, searchTerm) => {
    const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return content.substring(0, 100);
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + searchTerm.length + 50);
    
    return (start > 0 ? '...' : '') + 
           content.substring(start, end) + 
           (end < content.length ? '...' : '');
  }, []);

  return searchResults;
}

export function useTypingIndicator() {
  const [typingUsers, setTypingUsers] = useState({});

  const startTyping = useCallback((conversationId, userId) => {
    setTypingUsers(prev => ({
      ...prev,
      [`${conversationId}-${userId}`]: {
        conversationId,
        userId,
        startTime: Date.now()
      }
    }));

    // Auto-stop typing after 3 seconds
    setTimeout(() => {
      stopTyping(conversationId, userId);
    }, 3000);
  }, []);

  const stopTyping = useCallback((conversationId, userId) => {
    setTypingUsers(prev => {
      const key = `${conversationId}-${userId}`;
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const getTypingUsers = useCallback((conversationId) => {
    return Object.values(typingUsers)
      .filter(typing => typing.conversationId === conversationId)
      .map(typing => typing.userId);
  }, [typingUsers]);

  const isUserTyping = useCallback((conversationId, userId) => {
    return typingUsers[`${conversationId}-${userId}`] !== undefined;
  }, [typingUsers]);

  return {
    startTyping,
    stopTyping,
    getTypingUsers,
    isUserTyping
  };
}

export function useMessageReactions() {
  const [reactions, setReactions] = useState({});

  const addReaction = useCallback((messageId, reaction, userId = 'current-user') => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || {};
      const reactionUsers = messageReactions[reaction] || [];
      
      if (!reactionUsers.includes(userId)) {
        return {
          ...prev,
          [messageId]: {
            ...messageReactions,
            [reaction]: [...reactionUsers, userId]
          }
        };
      }
      
      return prev;
    });
  }, []);

  const removeReaction = useCallback((messageId, reaction, userId = 'current-user') => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || {};
      const reactionUsers = messageReactions[reaction] || [];
      
      const updatedUsers = reactionUsers.filter(id => id !== userId);
      
      if (updatedUsers.length === 0) {
        const { [reaction]: removed, ...otherReactions } = messageReactions;
        return {
          ...prev,
          [messageId]: otherReactions
        };
      }
      
      return {
        ...prev,
        [messageId]: {
          ...messageReactions,
          [reaction]: updatedUsers
        }
      };
    });
  }, []);

  const getReactions = useCallback((messageId) => {
    return reactions[messageId] || {};
  }, [reactions]);

  const hasUserReacted = useCallback((messageId, reaction, userId = 'current-user') => {
    const messageReactions = reactions[messageId] || {};
    const reactionUsers = messageReactions[reaction] || [];
    return reactionUsers.includes(userId);
  }, [reactions]);

  return {
    reactions,
    addReaction,
    removeReaction,
    getReactions,
    hasUserReacted
  };
}

export function useChatNotifications() {
  const { conversations, unreadCounts } = useChatContext();
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'default'
  );

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const showMessageNotification = useCallback((message, conversationTitle) => {
    if (notificationPermission !== 'granted') {
      return;
    }

    const notification = new Notification(`New message from ${conversationTitle}`, {
      body: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
      icon: '/icons/icon-192x192.png',
      tag: `message-${message.id}`,
      data: {
        conversationId: message.conversationId,
        messageId: message.id
      }
    });

    notification.onclick = () => {
      window.focus();
      // Navigate to conversation
      notification.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }, [notificationPermission]);

  const getTotalUnreadCount = useCallback(() => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  }, [unreadCounts]);

  const getUnreadByType = useCallback((type) => {
    return conversations
      .filter(conv => conv.type === type)
      .reduce((total, conv) => total + (unreadCounts[conv.id] || 0), 0);
  }, [conversations, unreadCounts]);

  return {
    notificationPermission,
    requestNotificationPermission,
    showMessageNotification,
    getTotalUnreadCount,
    getUnreadByType,
    canNotify: notificationPermission === 'granted'
  };
}

export function useMessageDrafts() {
  const [drafts, setDrafts] = useState({});

  const saveDraft = useCallback((conversationId, content) => {
    setDrafts(prev => ({
      ...prev,
      [conversationId]: {
        content,
        savedAt: new Date().toISOString()
      }
    }));
  }, []);

  const getDraft = useCallback((conversationId) => {
    return drafts[conversationId];
  }, [drafts]);

  const clearDraft = useCallback((conversationId) => {
    setDrafts(prev => {
      const { [conversationId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const hasDraft = useCallback((conversationId) => {
    return drafts[conversationId] !== undefined;
  }, [drafts]);

  return {
    drafts,
    saveDraft,
    getDraft,
    clearDraft,
    hasDraft
  };
}

export default useChat;
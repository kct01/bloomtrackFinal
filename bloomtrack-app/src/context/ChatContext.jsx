import { createContext, useContext, useReducer, useEffect } from 'react';
import { useApp } from './AppContext';

// Create the context
const ChatContext = createContext();

// Initial state
const initialState = {
  // Chat conversations
  conversations: {
    careTeam: [], // Messages with doctors, nurses, doulas
    community: [], // Community forum discussions
    support: [], // Peer support groups
    partner: [], // Messages with partner/family
    ai: [] // AI assistant conversations
  },

  // Active conversation
  activeChat: {
    type: null, // careTeam, community, support, partner, ai
    conversationId: null,
    participant: null
  },

  // Contacts and participants
  contacts: {
    careTeam: [],
    communityMembers: [],
    supportGroups: [],
    family: [],
    aiAssistants: []
  },

  // Message status and notifications
  notifications: {
    unreadCount: 0,
    unreadByType: {
      careTeam: 0,
      community: 0,
      support: 0,
      partner: 0,
      ai: 0
    },
    lastSeen: {},
    enableNotifications: true,
    soundEnabled: true
  },

  // Chat features
  features: {
    emergencyContact: { enabled: true, number: '' },
    autoResponders: { enabled: true },
    moderationFilters: { enabled: true },
    anonymousMode: { enabled: false },
    typingIndicators: { enabled: true },
    readReceipts: { enabled: true }
  },

  // Support resources
  resources: {
    quickReplies: [],
    emergencyPhrases: [],
    supportTopics: [],
    mentalHealthResources: [],
    crisisContacts: []
  }
};

// Message types with styling
const MESSAGE_TYPES = {
  text: { icon: '💬', label: 'Text Message' },
  image: { icon: '📷', label: 'Photo' },
  voice: { icon: '🎤', label: 'Voice Message' },
  appointment: { icon: '📅', label: 'Appointment' },
  reminder: { icon: '⏰', label: 'Reminder' },
  milestone: { icon: '🎯', label: 'Milestone Share' },
  emergency: { icon: '🚨', label: 'Emergency' },
  support: { icon: '🤗', label: 'Support Request' },
  celebration: { icon: '🎉', label: 'Celebration' },
  question: { icon: '❓', label: 'Question' },
  advice: { icon: '💡', label: 'Advice' },
  resource: { icon: '📚', label: 'Resource Share' }
};

// Pre-defined contacts and AI assistants
const DEFAULT_CONTACTS = {
  careTeam: [
    {
      id: 'dr-smith',
      name: 'Dr. Sarah Smith',
      role: 'OB-GYN',
      avatar: '👩‍⚕️',
      status: 'available',
      responseTime: '2-4 hours',
      specialties: ['High-risk pregnancy', 'Prenatal care']
    },
    {
      id: 'nurse-mary',
      name: 'Mary Johnson',
      role: 'Prenatal Nurse',
      avatar: '👩‍⚕️',
      status: 'available',
      responseTime: '1-2 hours',
      specialties: ['Pregnancy support', 'Birth preparation']
    },
    {
      id: 'doula-lisa',
      name: 'Lisa Chen',
      role: 'Certified Doula',
      avatar: '🤱',
      status: 'available',
      responseTime: '30 minutes',
      specialties: ['Birth support', 'Postpartum care']
    }
  ],
  aiAssistants: [
    {
      id: 'bloom-ai',
      name: 'Bloom Assistant',
      role: 'AI Pregnancy Support',
      avatar: '🌸',
      status: 'always available',
      responseTime: 'Instant',
      specialties: ['General pregnancy info', '24/7 support', 'Resource recommendations']
    },
    {
      id: 'wellness-ai',
      name: 'Wellness Coach',
      role: 'AI Wellness Guide',
      avatar: '🧘‍♀️',
      status: 'always available',
      responseTime: 'Instant',
      specialties: ['Mental health', 'Relaxation techniques', 'Emotional support']
    }
  ]
};

// Sample supportive messages and quick replies
const QUICK_REPLIES = {
  general: [
    "Thank you for your support! 💕",
    "That's really helpful advice",
    "I appreciate you sharing your experience",
    "Feeling much better now, thank you!",
    "That gives me a lot of hope",
    "I'll definitely try that",
    "You're so kind, thank you",
    "That makes me feel less alone"
  ],
  careTeam: [
    "When is my next appointment?",
    "I have some concerns to discuss",
    "Can you recommend any resources?",
    "I'm experiencing new symptoms",
    "Thank you for the guidance",
    "I'll follow your recommendations",
    "Can I schedule a call?",
    "Is this normal during pregnancy?"
  ],
  support: [
    "I'm feeling anxious today",
    "Can someone share their experience?",
    "I could use some encouragement",
    "Has anyone felt this way?",
    "Thank you all for being here",
    "Your stories give me strength",
    "I'm here if anyone needs support",
    "Sending love to everyone"
  ]
};

// Action types
const CHAT_ACTIONS = {
  // Conversation management
  CREATE_CONVERSATION: 'CREATE_CONVERSATION',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  CLEAR_ACTIVE_CHAT: 'CLEAR_ACTIVE_CHAT',
  
  // Message actions
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  
  // Contact management
  ADD_CONTACT: 'ADD_CONTACT',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  SET_CONTACT_STATUS: 'SET_CONTACT_STATUS',
  
  // Notification management
  MARK_AS_READ: 'MARK_AS_READ',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
  SET_LAST_SEEN: 'SET_LAST_SEEN',
  TOGGLE_NOTIFICATIONS: 'TOGGLE_NOTIFICATIONS',
  
  // Feature settings
  UPDATE_CHAT_FEATURES: 'UPDATE_CHAT_FEATURES',
  
  // AI and auto responses
  TRIGGER_AI_RESPONSE: 'TRIGGER_AI_RESPONSE',
  ADD_AUTO_RESPONSE: 'ADD_AUTO_RESPONSE'
};

// Reducer function
function chatReducer(state, action) {
  switch (action.type) {
    case CHAT_ACTIONS.CREATE_CONVERSATION:
      const newConversation = {
        id: `conv-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        messages: [],
        participants: action.payload.participants || [],
        lastActivity: new Date().toISOString()
      };

      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.type]: [...state.conversations[action.payload.type], newConversation]
        }
      };

    case CHAT_ACTIONS.SET_ACTIVE_CHAT:
      return {
        ...state,
        activeChat: {
          type: action.payload.type,
          conversationId: action.payload.conversationId,
          participant: action.payload.participant
        }
      };

    case CHAT_ACTIONS.CLEAR_ACTIVE_CHAT:
      return {
        ...state,
        activeChat: {
          type: null,
          conversationId: null,
          participant: null
        }
      };

    case CHAT_ACTIONS.SEND_MESSAGE:
      const { conversationType, conversationId, message } = action.payload;
      
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationType]: state.conversations[conversationType].map(conv =>
            conv.id === conversationId ? {
              ...conv,
              messages: [...conv.messages, {
                id: `msg-${Date.now()}`,
                ...message,
                timestamp: new Date().toISOString(),
                sender: 'user',
                status: 'sent'
              }],
              lastActivity: new Date().toISOString()
            } : conv
          )
        }
      };

    case CHAT_ACTIONS.RECEIVE_MESSAGE:
      const { type: msgType, convId, incomingMessage } = action.payload;
      
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [msgType]: state.conversations[msgType].map(conv =>
            conv.id === convId ? {
              ...conv,
              messages: [...conv.messages, {
                id: `msg-${Date.now()}`,
                ...incomingMessage,
                timestamp: new Date().toISOString(),
                status: 'received'
              }],
              lastActivity: new Date().toISOString()
            } : conv
          )
        },
        notifications: {
          ...state.notifications,
          unreadCount: state.notifications.unreadCount + 1,
          unreadByType: {
            ...state.notifications.unreadByType,
            [msgType]: state.notifications.unreadByType[msgType] + 1
          }
        }
      };

    case CHAT_ACTIONS.ADD_CONTACT:
      return {
        ...state,
        contacts: {
          ...state.contacts,
          [action.payload.type]: [...state.contacts[action.payload.type], action.payload.contact]
        }
      };

    case CHAT_ACTIONS.MARK_AS_READ:
      const { chatType, chatId } = action.payload;
      return {
        ...state,
        notifications: {
          ...state.notifications,
          unreadByType: {
            ...state.notifications.unreadByType,
            [chatType]: 0
          },
          lastSeen: {
            ...state.notifications.lastSeen,
            [chatId]: new Date().toISOString()
          }
        }
      };

    case CHAT_ACTIONS.TOGGLE_NOTIFICATIONS:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          enableNotifications: !state.notifications.enableNotifications
        }
      };

    case CHAT_ACTIONS.UPDATE_CHAT_FEATURES:
      return {
        ...state,
        features: { ...state.features, ...action.payload }
      };

    default:
      return state;
  }
}

// ChatProvider component
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useApp();

  // Initialize default contacts on mount
  useEffect(() => {
    initializeDefaultContacts();
    loadChatData();
  }, []);

  // Save chat data when state changes
  useEffect(() => {
    saveChatData();
  }, [state.conversations, state.contacts, state.features]);

  // Initialize default contacts
  const initializeDefaultContacts = () => {
    DEFAULT_CONTACTS.careTeam.forEach(contact => {
      dispatch({
        type: CHAT_ACTIONS.ADD_CONTACT,
        payload: { type: 'careTeam', contact }
      });
    });

    DEFAULT_CONTACTS.aiAssistants.forEach(contact => {
      dispatch({
        type: CHAT_ACTIONS.ADD_CONTACT,
        payload: { type: 'aiAssistants', contact }
      });
    });
  };

  // Local storage functions
  const saveChatData = () => {
    try {
      localStorage.setItem('bloomtrack_chat_data', JSON.stringify({
        conversations: state.conversations,
        contacts: state.contacts,
        features: state.features,
        notifications: state.notifications
      }));
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  const loadChatData = () => {
    try {
      const saved = localStorage.getItem('bloomtrack_chat_data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        
        // Restore conversations
        if (parsedData.conversations) {
          Object.keys(parsedData.conversations).forEach(type => {
            parsedData.conversations[type].forEach(conversation => {
              dispatch({
                type: CHAT_ACTIONS.CREATE_CONVERSATION,
                payload: conversation
              });
            });
          });
        }

        // Restore features
        if (parsedData.features) {
          dispatch({
            type: CHAT_ACTIONS.UPDATE_CHAT_FEATURES,
            payload: parsedData.features
          });
        }
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  };

  // Action creators
  const actions = {
    // Conversation management
    createConversation: (type, title, participants = []) => {
      dispatch({
        type: CHAT_ACTIONS.CREATE_CONVERSATION,
        payload: { type, title, participants }
      });
    },

    setActiveChat: (type, conversationId, participant = null) => {
      dispatch({
        type: CHAT_ACTIONS.SET_ACTIVE_CHAT,
        payload: { type, conversationId, participant }
      });

      // Mark as read when opening
      dispatch({
        type: CHAT_ACTIONS.MARK_AS_READ,
        payload: { chatType: type, chatId: conversationId }
      });
    },

    clearActiveChat: () => {
      dispatch({ type: CHAT_ACTIONS.CLEAR_ACTIVE_CHAT });
    },

    // Message actions
    sendMessage: (conversationType, conversationId, messageContent, messageType = 'text') => {
      const message = {
        content: messageContent,
        type: messageType,
        attachments: []
      };

      dispatch({
        type: CHAT_ACTIONS.SEND_MESSAGE,
        payload: { conversationType, conversationId, message }
      });

      // Simulate AI response for AI conversations
      if (conversationType === 'ai') {
        setTimeout(() => {
          actions.simulateAIResponse(conversationId, messageContent);
        }, 1000 + Math.random() * 2000); // 1-3 second delay
      }

      // Simulate care team response (in real app, this would be real)
      if (conversationType === 'careTeam') {
        setTimeout(() => {
          actions.simulateCareTeamResponse(conversationId, messageContent);
        }, 30000 + Math.random() * 60000); // 30-90 second delay
      }
    },

    // Quick message functions
    sendQuickReply: (conversationType, conversationId, replyText) => {
      actions.sendMessage(conversationType, conversationId, replyText, 'text');
    },

    sendEmergencyMessage: (message) => {
      // Send to all care team members
      state.contacts.careTeam.forEach(contact => {
        const emergencyConv = state.conversations.careTeam.find(conv => 
          conv.participants.includes(contact.id)
        );
        
        if (emergencyConv) {
          actions.sendMessage('careTeam', emergencyConv.id, `🚨 URGENT: ${message}`, 'emergency');
        }
      });
    },

    shareMilestone: (milestone, message = '') => {
      const shareMessage = `🎉 I just achieved a milestone: ${milestone.title}! ${message}`;
      
      // Share with community
      const communityConv = state.conversations.community[0];
      if (communityConv) {
        actions.sendMessage('community', communityConv.id, shareMessage, 'milestone');
      }
    },

    // AI simulation functions
    simulateAIResponse: (conversationId, userMessage) => {
      const responses = getAIResponse(userMessage);
      const response = responses[Math.floor(Math.random() * responses.length)];

      dispatch({
        type: CHAT_ACTIONS.RECEIVE_MESSAGE,
        payload: {
          type: 'ai',
          convId: conversationId,
          incomingMessage: {
            content: response,
            type: 'text',
            sender: 'bloom-ai',
            senderName: 'Bloom Assistant',
            senderAvatar: '🌸'
          }
        }
      });
    },

    simulateCareTeamResponse: (conversationId, userMessage) => {
      const responses = getCareTeamResponse(userMessage);
      const response = responses[Math.floor(Math.random() * responses.length)];

      dispatch({
        type: CHAT_ACTIONS.RECEIVE_MESSAGE,
        payload: {
          type: 'careTeam',
          convId: conversationId,
          incomingMessage: {
            content: response,
            type: 'text',
            sender: 'dr-smith',
            senderName: 'Dr. Sarah Smith',
            senderAvatar: '👩‍⚕️'
          }
        }
      });
    },

    // Contact management
    addContact: (type, contactData) => {
      dispatch({
        type: CHAT_ACTIONS.ADD_CONTACT,
        payload: { type, contact: { id: `contact-${Date.now()}`, ...contactData } }
      });
    },

    // Notification management
    toggleNotifications: () => {
      dispatch({ type: CHAT_ACTIONS.TOGGLE_NOTIFICATIONS });
    },

    markAsRead: (chatType, chatId) => {
      dispatch({
        type: CHAT_ACTIONS.MARK_AS_READ,
        payload: { chatType, chatId }
      });
    },

    // Feature updates
    updateChatFeatures: (features) => {
      dispatch({
        type: CHAT_ACTIONS.UPDATE_CHAT_FEATURES,
        payload: features
      });
    }
  };

  // AI response generator
  function getAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('kick') || message.includes('movement')) {
      return [
        "It's wonderful that you're feeling baby's movements! 💕 This usually starts around 18-20 weeks for first pregnancies.",
        "Baby movements are such a special part of pregnancy! Try to notice patterns - many babies are more active at certain times of day.",
        "Feeling kicks is a great sign that baby is healthy and active! Keep track of movement patterns as you get closer to your due date."
      ];
    }
    
    if (message.includes('tired') || message.includes('fatigue')) {
      return [
        "Pregnancy fatigue is so common, especially in the first and third trimesters. Make sure you're getting plenty of rest! 😴",
        "Your body is working incredibly hard growing a baby! Try to nap when you can and don't feel guilty about resting.",
        "Fatigue during pregnancy is totally normal. Stay hydrated, eat nutritious meals, and listen to your body's need for rest."
      ];
    }
    
    if (message.includes('anxious') || message.includes('worried') || message.includes('scared')) {
      return [
        "It's completely normal to feel anxious during pregnancy. You're going through a major life change! 🤗 Try some deep breathing exercises.",
        "Many expectant mothers experience anxiety. Consider talking to your care team if these feelings become overwhelming.",
        "Pregnancy anxiety is very common. Gentle exercise, meditation, and talking to other moms can really help. You're not alone! 💕"
      ];
    }
    
    if (message.includes('nausea') || message.includes('morning sickness')) {
      return [
        "Morning sickness affects many pregnant women, especially in the first trimester. Try eating small, frequent meals! 🍇",
        "For morning sickness, try ginger tea, crackers before getting up, and avoiding empty stomach. It usually improves after week 12!",
        "Nausea during pregnancy is tough but usually a sign of healthy hormone levels. Stay hydrated and eat what you can tolerate."
      ];
    }

    // Default supportive responses
    return [
      "Thank you for sharing with me! How are you feeling about your pregnancy journey today? 🌸",
      "I'm here to support you through this amazing time! Is there anything specific you'd like to know about? 💕",
      "Every pregnancy is unique and special. Remember to be gentle with yourself as your body grows your beautiful baby! 🤱",
      "You're doing an amazing job! Pregnancy is such a transformative time. How can I help support you today?",
      "I love hearing about your pregnancy experience! Remember that it's normal to have ups and downs. You've got this! 💪"
    ];
  }

  // Care team response generator
  function getCareTeamResponse(userMessage) {
    return [
      "Thank you for reaching out! I'll review your message and get back to you within a few hours. If this is urgent, please call our office.",
      "I appreciate you sharing this with me. Let's discuss this at your next appointment, or we can schedule a call if needed.",
      "This sounds like something we should address. I'll send you some resources and we can talk more about this soon.",
      "Thank you for keeping me updated on how you're feeling. Continue monitoring and let me know if anything changes.",
      "I'm glad you're staying in touch about your pregnancy progress. Keep up the great work taking care of yourself!"
    ];
  }

  // Computed values
  const computedValues = {
    // Get active conversation
    getActiveConversation: () => {
      if (!state.activeChat.type || !state.activeChat.conversationId) return null;
      
      return state.conversations[state.activeChat.type]?.find(
        conv => conv.id === state.activeChat.conversationId
      );
    },

    // Get all conversations sorted by last activity
    getAllConversations: () => {
      const allConversations = Object.values(state.conversations).flat();
      return allConversations.sort((a, b) => 
        new Date(b.lastActivity) - new Date(a.lastActivity)
      );
    },

    // Get unread count
    getTotalUnreadCount: () => {
      return Object.values(state.notifications.unreadByType).reduce((total, count) => total + count, 0);
    },

    // Get available contacts
    getAllContacts: () => {
      return Object.values(state.contacts).flat();
    },

    // Get quick replies for current context
    getQuickReplies: () => {
      const activeType = state.activeChat.type;
      if (activeType === 'careTeam') return QUICK_REPLIES.careTeam;
      if (activeType === 'support' || activeType === 'community') return QUICK_REPLIES.support;
      return QUICK_REPLIES.general;
    }
  };

  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    ...computedValues,
    
    // Constants
    MESSAGE_TYPES,
    QUICK_REPLIES,
    DEFAULT_CONTACTS
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use ChatContext
export function useChat() {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
}

// Export action types and constants
export { CHAT_ACTIONS, MESSAGE_TYPES, QUICK_REPLIES, DEFAULT_CONTACTS };
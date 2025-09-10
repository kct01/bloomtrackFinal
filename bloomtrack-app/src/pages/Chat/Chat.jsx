import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../../components/common/Button';
import styles from './Chat.module.css';

function Chat() {
  const { user } = useApp();
  const [posts, setPosts] = useState([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showCareTeamChat, setShowCareTeamChat] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [careTeamMessage, setCareTeamMessage] = useState('');
  const [aiMessage, setAIMessage] = useState('');
  const [careTeamMessages, setCareTeamMessages] = useState([]);
  const [aiMessages, setAIMessages] = useState([]);

  const categories = {
    all: { label: 'All Posts', icon: '💬', color: '#F4A6CD' },
    general: { label: 'General Chat', icon: '👋', color: '#FFB5A7' },
    pregnancy: { label: 'Pregnancy Questions', icon: '🤰', color: '#C8A8E9' },
    symptoms: { label: 'Symptoms & Health', icon: '🩺', color: '#A8D8A8' },
    support: { label: 'Support & Advice', icon: '💕', color: '#F4A261' },
    birth: { label: 'Birth Stories', icon: '👶', color: '#E8B4B8' }
  };

  // Initialize with mock posts and professional support messages
  useEffect(() => {
    const savedPosts = localStorage.getItem('bloomtrack_community_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error('Error loading posts:', error);
        initializeMockPosts();
      }
    } else {
      initializeMockPosts();
    }

    // Initialize care team messages
    const savedCareTeamMessages = localStorage.getItem('bloomtrack_care_team_messages');
    if (savedCareTeamMessages) {
      try {
        setCareTeamMessages(JSON.parse(savedCareTeamMessages));
      } catch (error) {
        initializeCareTeamMessages();
      }
    } else {
      initializeCareTeamMessages();
    }

    // Initialize AI messages
    const savedAIMessages = localStorage.getItem('bloomtrack_ai_messages');
    if (savedAIMessages) {
      try {
        setAIMessages(JSON.parse(savedAIMessages));
      } catch (error) {
        initializeAIMessages();
      }
    } else {
      initializeAIMessages();
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem('bloomtrack_community_posts', JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (careTeamMessages.length > 0) {
      localStorage.setItem('bloomtrack_care_team_messages', JSON.stringify(careTeamMessages));
    }
  }, [careTeamMessages]);

  useEffect(() => {
    if (aiMessages.length > 0) {
      localStorage.setItem('bloomtrack_ai_messages', JSON.stringify(aiMessages));
    }
  }, [aiMessages]);

  const initializeMockPosts = () => {
    const mockPosts = [
      {
        id: 1,
        title: "First time feeling kicks! 💕",
        content: "I'm 20 weeks and just felt my baby kick for the first time! It's the most amazing feeling ever. When did you all first feel movement?",
        author: "Sarah M.",
        authorWeek: 20,
        category: 'pregnancy',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        likes: 15,
        comments: [
          {
            id: 1,
            author: "Emma K.",
            authorWeek: 32,
            content: "Congratulations! I remember that moment so clearly. It gets even more amazing as they get stronger! 🥰",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            likes: 3
          },
          {
            id: 2,
            author: "Maria L.",
            authorWeek: 24,
            content: "I felt my first kicks around 18 weeks. Now at 24 weeks they're doing little dance parties in there! 💃",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            likes: 5
          }
        ]
      },
      {
        id: 2,
        title: "Morning sickness remedies that actually work?",
        content: "I'm 8 weeks and struggling with nausea all day. I've tried ginger tea and crackers but nothing seems to help. What worked for you?",
        author: "Ashley R.",
        authorWeek: 8,
        category: 'symptoms',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        likes: 8,
        comments: [
          {
            id: 3,
            author: "Jennifer C.",
            authorWeek: 16,
            content: "Vitamin B6 supplements were a game changer for me! Also eating small frequent meals throughout the day. Hang in there! 💪",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            likes: 6
          },
          {
            id: 4,
            author: "Lisa W.",
            authorWeek: 28,
            content: "Peppermint tea and lemon drops helped me survive those first weeks. Also keeping crackers by your bedside! You've got this! ❤️",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            likes: 4
          }
        ]
      },
      {
        id: 3,
        title: "Any other first-time moms feeling overwhelmed?",
        content: "I'm 28 weeks with my first baby and sometimes I feel so overwhelmed thinking about everything I need to prepare. Is this normal? How are you all coping?",
        author: "Rachel T.",
        authorWeek: 28,
        category: 'support',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        likes: 22,
        comments: [
          {
            id: 5,
            author: "Stephanie H.",
            authorWeek: 35,
            content: "Completely normal! I felt the same way. Take it one day at a time and remember you don't need everything perfect before baby arrives. You're going to be an amazing mom! 🌟",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            likes: 8
          },
          {
            id: 6,
            author: "Nicole P.",
            authorWeek: 22,
            content: "YES! I'm also a first-time mom and the anxiety is real. What helps me is making lists and talking to other moms. We're all figuring it out together! 💕",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            likes: 7
          }
        ]
      },
      {
        id: 4,
        title: "Favorite pregnancy apps and resources?",
        content: "What apps or websites have been most helpful during your pregnancy journey? I love BloomTrack but looking for other recommendations too!",
        author: "Amanda K.",
        authorWeek: 15,
        category: 'general',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        likes: 12,
        comments: [
          {
            id: 7,
            author: "Melissa D.",
            authorWeek: 30,
            content: "I love pregnancy meditation apps! Also following some pregnancy yoga YouTube channels has been amazing for staying active. 🧘‍♀️",
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            likes: 5
          }
        ]
      }
    ];

    setPosts(mockPosts);
  };

  const initializeCareTeamMessages = () => {
    const mockCareTeamMessages = [
      {
        id: 1,
        sender: 'Dr. Sarah Johnson',
        role: 'OB/GYN',
        message: 'Hello! Welcome to your care team messaging. I\'m here to answer any medical questions you have about your pregnancy. Feel free to reach out anytime!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isFromTeam: true
      },
      {
        id: 2,
        sender: 'Nurse Emma',
        role: 'Pregnancy Coordinator',
        message: 'Don\'t forget your upcoming appointment next Tuesday at 2:00 PM. We\'ll be doing your routine checkup and discussing your birth plan. Looking forward to seeing you!',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isFromTeam: true
      }
    ];
    setCareTeamMessages(mockCareTeamMessages);
  };

  const initializeAIMessages = () => {
    const mockAIMessages = [
      {
        id: 1,
        sender: 'AI Assistant',
        message: 'Hi! I\'m your pregnancy AI assistant. I can help answer questions about pregnancy symptoms, nutrition, exercise, and general wellness. What would you like to know?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isFromAI: true
      }
    ];
    setAIMessages(mockAIMessages);
  };

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleNewPost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      const post = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        author: user.name || 'Anonymous',
        authorWeek: 20, // Could be dynamic from user's pregnancy data
        category: newPost.category,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
      };

      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', category: 'general' });
      setShowNewPostModal(false);
    }
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleAddComment = (postId, commentText) => {
    if (commentText.trim()) {
      const comment = {
        id: Date.now(),
        author: user.name || 'Anonymous',
        authorWeek: 20,
        content: commentText,
        timestamp: new Date().toISOString(),
        likes: 0
      };

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, comment] }
          : post
      ));
    }
  };

  const handleSendCareTeamMessage = () => {
    if (careTeamMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: user.name || 'You',
        message: careTeamMessage,
        timestamp: new Date().toISOString(),
        isFromTeam: false
      };

      setCareTeamMessages([...careTeamMessages, newMessage]);
      setCareTeamMessage('');

      // Simulate a response from care team
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          sender: 'Dr. Sarah Johnson',
          role: 'OB/GYN',
          message: 'Thank you for your message! I\'ll review this and get back to you within 24 hours. If this is urgent, please call our office directly.',
          timestamp: new Date().toISOString(),
          isFromTeam: true
        };
        setCareTeamMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleSendAIMessage = () => {
    if (aiMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: user.name || 'You',
        message: aiMessage,
        timestamp: new Date().toISOString(),
        isFromAI: false
      };

      setAIMessages([...aiMessages, newMessage]);
      setAIMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponses = [
          'That\'s a great question! During pregnancy, it\'s important to stay hydrated and eat nutritious foods. Would you like specific recommendations?',
          'Many expecting mothers experience this. It\'s generally normal, but I recommend discussing any concerns with your healthcare provider.',
          'Exercise during pregnancy can be very beneficial! Light activities like walking, swimming, and prenatal yoga are usually safe. Always check with your doctor first.',
          'Pregnancy symptoms can vary greatly between individuals. Rest, proper nutrition, and staying active (as approved by your doctor) can help manage many common symptoms.',
          'That sounds like a normal part of pregnancy! However, for personalized medical advice, please consult with your healthcare provider.'
        ];
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const response = {
          id: Date.now() + 1,
          sender: 'AI Assistant',
          message: randomResponse,
          timestamp: new Date().toISOString(),
          isFromAI: true
        };
        setAIMessages(prev => [...prev, response]);
      }, 1500);
    }
  };

  return (
    <div className={styles.chatPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>💬 Community & Support</h1>
          <p className={styles.pageSubtitle}>
            Connect with other expecting mothers, share experiences, and get support
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button 
            variant="primary" 
            onClick={() => setShowNewPostModal(true)}
            className={styles.newPostButton}
          >
            ✏️ New Post
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <div className={styles.categoryButtons}>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              className={`${styles.categoryButton} ${activeCategory === key ? styles.active : ''}`}
              onClick={() => setActiveCategory(key)}
              style={{ '--category-color': category.color }}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryLabel}>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className={styles.postsContainer}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLikePost}
              onAddComment={handleAddComment}
              formatTimeAgo={formatTimeAgo}
              categories={categories}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h3>No posts yet in this category</h3>
            <p>Be the first to start a conversation!</p>
            <Button 
              variant="primary" 
              onClick={() => setShowNewPostModal(true)}
            >
              Create First Post
            </Button>
          </div>
        )}
      </div>

      {/* Professional Support Section */}
      <div className={styles.professionalSupport}>
        <div className={styles.supportHeader}>
          <h2 className={styles.supportTitle}>🩺 Professional Support</h2>
          <p className={styles.supportSubtitle}>Connect with your care team and AI assistant</p>
        </div>

        <div className={styles.supportCards}>
          {/* Care Team Messaging */}
          <div className={styles.supportCard}>
            <div className={styles.supportCardHeader}>
              <div className={styles.supportCardIcon}>👩‍⚕️</div>
              <div className={styles.supportCardInfo}>
                <h3 className={styles.supportCardTitle}>Care Team Messages</h3>
                <p className={styles.supportCardDesc}>Direct communication with your healthcare providers</p>
              </div>
              <div className={styles.supportCardStatus}>
                <span className={styles.onlineStatus}>● Online</span>
              </div>
            </div>
            
            <div className={styles.supportCardActions}>
              <Button 
                variant="gentle" 
                size="medium"
                onClick={() => setShowCareTeamChat(true)}
                className={styles.supportButton}
              >
                💬 Message Care Team
              </Button>
              {careTeamMessages.length > 0 && (
                <span className={styles.messageCount}>
                  {careTeamMessages.filter(msg => msg.isFromTeam).length} new messages
                </span>
              )}
            </div>
          </div>

          {/* AI Assistant */}
          <div className={styles.supportCard}>
            <div className={styles.supportCardHeader}>
              <div className={styles.supportCardIcon}>🤖</div>
              <div className={styles.supportCardInfo}>
                <h3 className={styles.supportCardTitle}>AI Pregnancy Assistant</h3>
                <p className={styles.supportCardDesc}>24/7 instant answers to your pregnancy questions</p>
              </div>
              <div className={styles.supportCardStatus}>
                <span className={styles.onlineStatus}>● Always Available</span>
              </div>
            </div>
            
            <div className={styles.supportCardActions}>
              <Button 
                variant="gentle" 
                size="medium"
                onClick={() => setShowAIChat(true)}
                className={styles.supportButton}
              >
                🤖 Chat with AI Assistant
              </Button>
              <span className={styles.messageCount}>
                Instant responses • Free to use
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewPostModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>✏️ Create New Post</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowNewPostModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <select
                  className={styles.formSelect}
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                >
                  {Object.entries(categories).filter(([key]) => key !== 'all').map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Title</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="What's on your mind?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Question or Message</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Share your thoughts, ask questions, or offer support..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows="4"
                />
              </div>

              <div className={styles.modalActions}>
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={() => setShowNewPostModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="medium"
                  onClick={handleNewPost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                >
                  💕 Post to Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Care Team Chat Modal */}
      {showCareTeamChat && (
        <div className={styles.modalOverlay} onClick={() => setShowCareTeamChat(false)}>
          <div className={styles.chatModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.chatModalHeader}>
              <div className={styles.chatHeaderInfo}>
                <h3>👩‍⚕️ Care Team Messages</h3>
                <span className={styles.onlineIndicator}>● Your healthcare providers</span>
              </div>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCareTeamChat(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.chatMessages}>
              {careTeamMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${styles.chatMessage} ${message.isFromTeam ? styles.teamMessage : styles.userMessage}`}
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.messageSender}>
                      {message.isFromTeam ? `${message.sender} (${message.role})` : message.sender}
                    </span>
                    <span className={styles.messageTime}>
                      {formatTimeAgo(message.timestamp)}
                    </span>
                  </div>
                  <p className={styles.messageText}>{message.message}</p>
                </div>
              ))}
            </div>

            <div className={styles.chatInput}>
              <textarea
                className={styles.chatTextarea}
                placeholder="Type your message to your care team..."
                value={careTeamMessage}
                onChange={(e) => setCareTeamMessage(e.target.value)}
                rows="3"
              />
              <Button 
                variant="primary" 
                size="medium"
                onClick={handleSendCareTeamMessage}
                disabled={!careTeamMessage.trim()}
                className={styles.sendButton}
              >
                💬 Send Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className={styles.modalOverlay} onClick={() => setShowAIChat(false)}>
          <div className={styles.chatModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.chatModalHeader}>
              <div className={styles.chatHeaderInfo}>
                <h3>🤖 AI Pregnancy Assistant</h3>
                <span className={styles.onlineIndicator}>● Always available for support</span>
              </div>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAIChat(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.chatMessages}>
              {aiMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${styles.chatMessage} ${message.isFromAI ? styles.aiMessage : styles.userMessage}`}
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.messageSender}>{message.sender}</span>
                    <span className={styles.messageTime}>
                      {formatTimeAgo(message.timestamp)}
                    </span>
                  </div>
                  <p className={styles.messageText}>{message.message}</p>
                </div>
              ))}
            </div>

            <div className={styles.chatInput}>
              <textarea
                className={styles.chatTextarea}
                placeholder="Ask me anything about pregnancy, symptoms, nutrition, or wellness..."
                value={aiMessage}
                onChange={(e) => setAIMessage(e.target.value)}
                rows="3"
              />
              <Button 
                variant="primary" 
                size="medium"
                onClick={handleSendAIMessage}
                disabled={!aiMessage.trim()}
                className={styles.sendButton}
              >
                🤖 Ask AI Assistant
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// PostCard Component
function PostCard({ post, onLike, onAddComment, formatTimeAgo, categories }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          <div className={styles.authorAvatar}>
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>{post.author}</span>
            <span className={styles.authorMeta}>
              Week {post.authorWeek} • {formatTimeAgo(post.timestamp)}
            </span>
          </div>
        </div>
        <div className={styles.postCategory}>
          <span 
            className={styles.categoryTag}
            style={{ backgroundColor: categories[post.category]?.color + '20', color: categories[post.category]?.color }}
          >
            {categories[post.category]?.icon} {categories[post.category]?.label}
          </span>
        </div>
      </div>

      <div className={styles.postContent}>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <p className={styles.postText}>{post.content}</p>
      </div>

      <div className={styles.postActions}>
        <button 
          className={styles.actionButton}
          onClick={() => onLike(post.id)}
        >
          💕 {post.likes}
        </button>
        <button 
          className={styles.actionButton}
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          {post.comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <div className={styles.commentAvatar}>
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className={styles.commentInfo}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <span className={styles.commentMeta}>
                    Week {comment.authorWeek} • {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
              </div>
              <p className={styles.commentText}>{comment.content}</p>
            </div>
          ))}

          <div className={styles.addComment}>
            <textarea
              className={styles.commentInput}
              placeholder="Add a supportive comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="2"
            />
            <Button 
              variant="gentle" 
              size="small"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              💬 Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
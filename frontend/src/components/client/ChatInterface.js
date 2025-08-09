import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Camera, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  Info,
  ChevronDown,
  Check,
  CheckCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [trainerInfo, setTrainerInfo] = useState({
    name: 'Mike Johnson',
    avatar: '/api/placeholder/40/40',
    status: 'online',
    lastSeen: null
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const sampleMessages = [
    {
      id: 1,
      senderId: 'trainer',
      senderName: 'Mike Johnson',
      content: 'Hey! Great workout today! How are you feeling?',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
      status: 'read'
    },
    {
      id: 2,
      senderId: 'client',
      senderName: 'You',
      content: 'Thanks Mike! Feeling good, definitely pushed myself on those squats 💪',
      timestamp: new Date(Date.now() - 3300000),
      type: 'text',
      status: 'read'
    },
    {
      id: 3,
      senderId: 'trainer',
      senderName: 'Mike Johnson',
      content: 'That\'s what I like to hear! Your form looked perfect. Let\'s increase the weight by 10lbs next session.',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text',
      status: 'read'
    },
    {
      id: 4,
      senderId: 'client',
      senderName: 'You',
      content: 'Sounds good! Quick question about nutrition - should I eat before morning workouts?',
      timestamp: new Date(Date.now() - 2700000),
      type: 'text',
      status: 'read'
    },
    {
      id: 5,
      senderId: 'trainer',
      senderName: 'Mike Johnson',
      content: 'Great question! For morning workouts, a small snack 30-45 mins before is perfect. Try a banana or some oats.',
      timestamp: new Date(Date.now() - 2400000),
      type: 'text',
      status: 'read'
    },
    {
      id: 6,
      senderId: 'trainer',
      senderName: 'Mike Johnson',
      content: 'I\'ve also updated your meal plan with some pre-workout snack options. Check it out in the nutrition tab!',
      timestamp: new Date(Date.now() - 2100000),
      type: 'text',
      status: 'read'
    },
    {
      id: 7,
      senderId: 'client',
      senderName: 'You',
      content: 'Perfect timing! I was just looking at that. The overnight oats recipe looks amazing.',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text',
      status: 'read'
    },
    {
      id: 8,
      senderId: 'trainer',
      senderName: 'Mike Johnson',
      content: 'The overnight oats are a game changer! Super convenient for busy mornings.',
      timestamp: new Date(Date.now() - 900000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: 9,
      senderId: 'trainer',
      senderName: 'Mike Johnson',
      content: 'How\'s your energy been lately? Any changes since we adjusted your macros?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      status: 'delivered'
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return messageTime.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      id: Date.now(),
      senderId: 'client',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'sent' } : msg
      ));
      
      // Simulate trainer typing response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          "Thanks for the update! Keep up the great work! 🔥",
          "That's awesome! I'm so proud of your progress!",
          "Great question! Let me get back to you with a detailed answer.",
          "Perfect! You're really getting the hang of this!",
          "Excellent work! Your dedication is really showing."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const trainerMessage = {
          id: Date.now() + 1,
          senderId: 'trainer',
          senderName: 'Mike Johnson',
          content: randomResponse,
          timestamp: new Date(),
          type: 'text',
          status: 'read'
        };
        
        setMessages(prev => [...prev, trainerMessage]);
      }, 2000);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const message = {
          id: Date.now(),
          senderId: 'client',
          senderName: 'You',
          content: e.target.result,
          timestamp: new Date(),
          type: file.type.startsWith('image/') ? 'image' : 'file',
          fileName: file.name,
          fileSize: file.size,
          status: 'sending'
        };
        
        setMessages(prev => [...prev, message]);
        
        // Simulate file upload
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === message.id ? { ...msg, status: 'sent' } : msg
          ));
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sending':
        return <Clock size={14} className="status-icon sending" />;
      case 'sent':
        return <Check size={14} className="status-icon sent" />;
      case 'delivered':
        return <CheckCheck size={14} className="status-icon delivered" />;
      case 'read':
        return <CheckCheck size={14} className="status-icon read" />;
      default:
        return null;
    }
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.senderId === 'client';
    
    return (
      <div key={message.id} className={`message ${isOwnMessage ? 'own' : 'other'}`}>
        {!isOwnMessage && (
          <div className="message-avatar">
            <img src={trainerInfo.avatar} alt={message.senderName} />
          </div>
        )}
        <div className="message-content">
          <div className="message-bubble">
            {message.type === 'text' && (
              <p>{message.content}</p>
            )}
            {message.type === 'image' && (
              <div className="message-image">
                <img src={message.content} alt="Shared image" />
              </div>
            )}
            {message.type === 'file' && (
              <div className="message-file">
                <Paperclip size={16} />
                <div className="file-info">
                  <span className="file-name">{message.fileName}</span>
                  <span className="file-size">{(message.fileSize / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            )}
          </div>
          <div className="message-meta">
            <span className="message-time">{formatTime(message.timestamp)}</span>
            {isOwnMessage && getMessageStatus(message.status)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="trainer-info">
          <div className="trainer-avatar">
            <img src={trainerInfo.avatar} alt={trainerInfo.name} />
            <div className={`status-dot ${trainerInfo.status}`} />
          </div>
          <div className="trainer-details">
            <h3>{trainerInfo.name}</h3>
            <p className="trainer-status">
              {trainerInfo.status === 'online' ? 'Online' : `Last seen ${formatTime(trainerInfo.lastSeen)}`}
            </p>
          </div>
        </div>
        <div className="chat-actions">
          <button className="action-btn">
            <Phone size={20} />
          </button>
          <button className="action-btn">
            <Video size={20} />
          </button>
          <button className="action-btn">
            <Info size={20} />
          </button>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {messages.map(renderMessage)}
          {isTyping && (
            <div className="message other">
              <div className="message-avatar">
                <img src={trainerInfo.avatar} alt={trainerInfo.name} />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-container">
        {connectionStatus !== 'connected' && (
          <div className="connection-status">
            <AlertCircle size={16} />
            <span>
              {connectionStatus === 'connecting' ? 'Reconnecting...' : 'Connection lost'}
            </span>
          </div>
        )}
        
        <div className="chat-input">
          <button 
            className="input-action"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>
          <button 
            className="input-action"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={20} />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="message-input"
            />
            <button className="emoji-btn">
              <Smile size={20} />
            </button>
          </div>
          
          <button 
            className="send-btn"
            onClick={sendMessage}
            disabled={newMessage.trim() === ''}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
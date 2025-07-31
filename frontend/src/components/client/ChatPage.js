import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Users, MessageSquarePlus } from 'lucide-react';
import ApiClient from '../../utils/ApiClient';
import EmptyState from '../common/EmptyState';

const ChatBubble = ({ msg, client, isGroup }) => {
  const isClient = msg.sender === 'client';
  const senderName = isClient ? 'You' : (msg.sender_name || 'Trainer');
  const avatarInitial = (isClient ? client.first_name : (msg.sender_name || 'T')).charAt(0).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 ${isClient ? 'justify-end' : 'justify-start'}`}
    >
      {!isClient && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-heading font-bold flex-shrink-0" title={senderName}>
          {avatarInitial}
        </div>
      )}
      <div className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
        {!isClient && isGroup && <p className="text-xs text-text-secondary mb-1 ml-2">{senderName}</p>}
        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md ${isClient ? 'bg-brand-primary text-white rounded-br-none' : 'bg-content-bg-alt dark:bg-gray-700 rounded-bl-none'}`}>
          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
          <p className={`text-xs mt-1 ${isClient ? 'text-gray-200' : 'text-text-secondary'} text-right`}>
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      {isClient && (
        <div className="w-8 h-8 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold flex-shrink-0" title={senderName}>
          {avatarInitial}
        </div>
      )}
    </motion.div>
  );
};

const ChatPage = ({ client, sharedData, onDataUpdate, showNotification }) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('trainer'); // 'trainer' or group id
  const messagesEndRef = useRef(null);
  const { messages, clientGroups } = sharedData;

  const tabs = [{ id: 'trainer', name: 'Trainer', icon: User }, ...(clientGroups || []).map(g => ({ id: g.id, name: g.name, icon: Users }))];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      text: message,
      sender: 'client',
      client_id: client.id,
      ...(activeTab !== 'trainer' && { group_id: activeTab })
    };

    try {
      await ApiClient.sendMessage(messageData);
      setMessage('');
      onDataUpdate(); // This should trigger a fetch for new messages
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification('Send Failed', 'Could not send message. Please try again.', 'error');
    }
  };

  const currentMessages = activeTab === 'trainer'
    ? (messages || []).filter(m => !m.group_id)
    : (messages || []).filter(m => m.group_id === activeTab);

  const activeTabInfo = tabs.find(t => t.id === activeTab);
  const isTrainerChat = activeTab === 'trainer';

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-primary-bg text-text-primary">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-display mb-4">Chat</h1>
        <div className="relative bg-content-bg-alt/80 dark:bg-gray-800/80 p-1.5 flex gap-2 rounded-xl mb-4 backdrop-blur-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 p-2.5 flex items-center justify-center gap-2 rounded-lg transition-colors z-10 ${activeTab === tab.id ? 'text-white' : 'text-text-secondary hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}>
              <tab.icon className="w-5 h-5" />
              <span className="font-semibold">{tab.name}</span>
            </button>
          ))}
          <AnimatePresence>
            {activeTab && (
              <motion.div
                layoutId="activeChatTab"
                className="absolute inset-0 bg-brand-primary rounded-lg z-0"
                initial={false}
                animate={{ x: tabs.findIndex(t => t.id === activeTab) * 100 + '%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex-grow flex flex-col bg-content-bg dark:bg-gray-800/50 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex-grow p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <AnimatePresence mode='sync'>
            {currentMessages.length > 0 ? (
              currentMessages.map((msg) => <ChatBubble key={msg.id || msg.timestamp} msg={msg} client={client} isGroup={activeTab !== 'trainer'} />)
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center">
                <EmptyState
                  icon={MessageSquarePlus}
                  title={isTrainerChat ? `Chat with ${activeTabInfo?.name}` : `Welcome to ${activeTabInfo?.name}!`}
                  message={isTrainerChat 
                    ? "This is your direct line for questions, updates, and support. Don't hesitate to reach out!"
                    : "Introduce yourself, share your progress, and connect with other members. Let's get stronger together!"
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-content-bg-alt/80 dark:bg-gray-900/50 border-t border-border-light dark:border-gray-700/50 flex items-center gap-3 backdrop-blur-sm">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="input-premium flex-grow bg-gray-200/50 dark:bg-gray-700/50 focus:ring-brand-primary"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" className="btn-primary-icon aspect-square">
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;

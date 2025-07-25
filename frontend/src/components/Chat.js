import React from 'react';
import { MessageCircle } from 'lucide-react';

const Chat = () => {
  return (
    <div className="min-h-screen bg-warm-black p-6">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold text-warm-white mb-2">Chat</h1>
        <p className="text-warm-white opacity-60">
          Real-time messaging with your clients
        </p>
      </div>

      <div className="card text-center py-12">
        <MessageCircle className="w-16 h-16 text-warm-white opacity-30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-white mb-2">Chat System</h3>
        <p className="text-warm-white opacity-60">
          Real-time messaging interface coming soon...
        </p>
      </div>
    </div>
  );
};

export default Chat; 
import React, { useState } from 'react';
import { LuMessageSquare, LuSend } from 'react-icons/lu';

export default function AdminChatWidget() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      text: "Hi there! 👋 Welcome to UpFilly Support. How can we help you today?",
      sender: 'admin',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickReplies = [
    "How to set up custom domain?",
    "Plan inquiry",
    "How to set up Stripe configuration ",
    "Other"
  ];

  const handleSendMessage = (text?: string) => {
    const messageText = typeof text === 'string' ? text : inputValue;
    if (!messageText.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '700px',
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'linear-gradient(135deg, #1c306d 0%, #0f172a 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#fff'
          }}>
            <LuMessageSquare size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a', fontWeight: 600 }}>UpFilly Admin Support</h3>
            <span style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              Online - Typically replies in a few minutes
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        background: '#f1f5f9',
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '12px', maxWidth: '80%', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
            {msg.sender === 'admin' && (
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: '#1c306d', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0
              }}>
                <LuMessageSquare size={16} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                background: msg.sender === 'user' ? '#2563eb' : '#ffffff', 
                padding: '14px 18px', 
                borderRadius: '16px', 
                borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px', 
                borderTopLeftRadius: msg.sender === 'admin' ? '4px' : '16px', 
                border: msg.sender === 'admin' ? '1px solid #e2e8f0' : 'none', 
                color: msg.sender === 'user' ? '#ffffff' : '#334155', 
                fontSize: '14px', 
                lineHeight: '1.5', 
                boxShadow: msg.sender === 'user' ? '0 1px 2px rgba(37,99,235,0.1)' : '0 1px 2px rgba(0,0,0,0.02)' 
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', margin: msg.sender === 'user' ? '0 4px 0 0' : '0 0 0 4px' }}>
                {msg.sender === 'user' ? 'You' : 'UpFilly Admin'} • {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Quick Reply Chips (Show only if no user messages exist yet) */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '-8px', paddingLeft: '48px', maxWidth: '85%' }}>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(reply)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  fontWeight: 500
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px 24px',
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }}>
        <input 
          type="text" 
          placeholder="Write your message here..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: '14px 20px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            fontSize: '14px',
            outline: 'none',
            color: '#0f172a',
            transition: 'border-color 0.2s'
          }}
        />
        <button 
          onClick={() => handleSendMessage()}
          style={{ 
          background: '#2563eb', 
          color: '#ffffff', 
          border: 'none', 
          borderRadius: '50%', 
          width: '46px', 
          height: '46px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          transition: 'transform 0.1s'
        }}>
          <LuSend size={20} style={{ marginLeft: '-2px', marginTop: '2px' }} />
        </button>
      </div>
    </div>
  );
}

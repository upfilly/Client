'use client'

import React, { useState, useEffect, useRef } from 'react';
import { LuMessageSquare, LuSend } from 'react-icons/lu';
import axios from 'axios';
import crendentialModel from '@/models/credential.model';
import { ConnectSocket, SocketURL } from '../chat/socket';

export interface Message {
  id: number | string;
  text: string;
  sender: 'admin' | 'user';
  time: string;
}

export interface User {
  id?: string;
  _id?: string;
  addedBy?: string;
  [key: string]: unknown;
}

export default function AdminChatWidget() {
  const [messages, setMessages] = useState<Message[]>([

    {
      id: 1,
      text: "Hi there! 👋 Welcome to UpFilly Support. How can we help you today?",
      sender: 'admin',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [targetAdminId, setTargetAdminId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "How to set up custom domain?",
    "Plan inquiry",
    "How to set up Stripe configuration ",
    "Other"
  ];

  useEffect(() => {
    // Initial static message
    setMessages([
      {
        id: 1,
        text: "Hi there! 👋 Welcome to UpFilly Support. How can we help you today?",
        sender: 'admin',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    const currentUser = crendentialModel.getUser();
    setUser(currentUser);
    ConnectSocket.connect();

    if (currentUser) {
      ConnectSocket.emit("user-online", { user_id: currentUser?.id });

      // Dynamically resolve the admin ID
      const addedUserStr = typeof window !== 'undefined' ? localStorage.getItem('addedUser') : null;
      let computedAdminId: string | null = null;
      if (addedUserStr) {
        try {
          const addedUser = JSON.parse(addedUserStr);
          computedAdminId = addedUser?.id || addedUser?._id;
        } catch (e) { }
      }

      if (!computedAdminId) {
        computedAdminId = currentUser?.addedBy || currentUser?.id; // fallback to addedBy or self
      }
      
      // Fallback to super admin if all else fails
      if (!computedAdminId) {
        computedAdminId = "654227e78fd3b1018600710d";
      }

      setTargetAdminId(computedAdminId);

      // Match the exact same logic as the chatbot module to persist old chats
      const payload = {
        chat_by: currentUser?.email||  currentUser.id,
      };

      axios.post(`${SocketURL}chat/user/join-group-bot`, payload).then((res) => {
        if (res?.data?.success) {
          const data = res.data;
          setRoomId(data.data.room_id);
          
          const userId = currentUser.id || data.data.user_id;
          joinRoom(data.data.room_id, userId);
          
          // Use the dynamic admin ID
          fetchMessages(data.data.room_id, computedAdminId as string, userId);
        }
      });
    };
  }, []);

  const joinRoom = (rId: string, uId: string) => {
    const payload = {
      room_id: rId,
      user_id: uId,
    };
    ConnectSocket.emit("join-room", payload);
  };

  const fetchMessages = (rId: string, aId: string, uId: string) => {
    axios
      .get(`${SocketURL}chat/user/message/all?room_id=${rId}&user_id=${aId}&login_user_id=${uId}`)
      .then((res) => {
        if (res?.data?.success) {
          const fetchedMessages = res.data.data.data.map((msg: { _id: string; content: string; sender: string; createdAt: string | Date }) => ({
            id: msg._id,
            text: msg.content,
            sender: msg.sender === uId ? 'user' : 'admin',
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

          if (fetchedMessages.length > 0) {
            setMessages(fetchedMessages);
            setTimeout(() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
              }
            }, 100);
          }
        }
      });
  };

  useEffect(() => {
    const handleReceiveMessage = (newdata: { data?: { _doc?: { room_id?: string; _id?: string; content?: string; sender?: string; createdAt?: string | Date } } }) => {
      const data = newdata.data;
      if (data?._doc?.room_id === roomId) {
        setIsTyping(false); // Stop typing animation when message received
        const payload: Message = {
          id: data?._doc?._id || Date.now(),
          text: data?._doc?.content || '',
          sender: data?._doc?.sender === user?.id ? 'user' : 'admin',
          time: new Date(data?._doc?.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Check if message is a duplicate before adding
        setMessages((prevChat) => {
          const isDuplicate = prevChat.some(msg => msg.text === payload.text && msg.sender === payload.sender && Math.abs(new Date(`1970/01/01 ${msg.time}`).getTime() - new Date(`1970/01/01 ${payload.time}`).getTime()) < 60000);
          if (!isDuplicate) {
            return [...prevChat, payload];
          }
          return prevChat;
        });
      }
    };

    let typingTimer: NodeJS.Timeout;
    const handleTyping = (data: { data?: { typing?: boolean; room_id?: string } }) => {
      if (data?.data?.typing && data?.data?.room_id === roomId) {
        setIsTyping(true);
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    ConnectSocket.on("receive-message", handleReceiveMessage);
    ConnectSocket.on("typing", handleTyping);
    return () => {
      ConnectSocket.off("receive-message", handleReceiveMessage);
      ConnectSocket.off("typing", handleTyping);
      clearTimeout(typingTimer);
    };
  }, [roomId, user]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text?: string) => {
    const messageText = typeof text === 'string' ? text : inputValue;
    if (!messageText.trim()) return;

    // Send to backend if connected
    if (roomId && user) {
      const payload = {
        content: messageText,
        room_id: roomId,
        user_id: user.id,
        reciver_id: targetAdminId || "654227e78fd3b1018600710d", // dynamic admin ID
        type: "TEXT"
      };
      ConnectSocket.emit("send-message", payload);

      // Add user message locally immediately to mirror chatbot UX
      const newMsg: Message = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMsg]);
    } else {
      // Fallback local update if socket not ready
      const newMsg: Message = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
    }

    setInputValue('');

    // If it's their first actual message, simulate the admin auto-reply locally (doesn't go to DB)
    if (messages.length === 1) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            text: "Thanks for reaching out! An admin has been notified and will join the chat shortly to assist you.",
            sender: 'admin',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          } as Message
        ]);
      }, 2000);
    }
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
      <style>
        {`
          @keyframes typing-dot {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-4px); opacity: 1; }
          }
        `}
      </style>
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
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        style={{
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
                boxShadow: msg.sender === 'user' ? '0 1px 2px rgba(37,99,235,0.1)' : '0 1px 2px rgba(0,0,0,0.02)',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
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
        {messages.length === 1 && !isTyping && (
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

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', maxWidth: '80%', alignSelf: 'flex-start', flexDirection: 'row' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
              <div style={{
                background: '#ffffff',
                padding: '14px 18px',
                borderRadius: '16px',
                borderTopLeftRadius: '4px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                height: '49px'
              }}>
                <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'typing-dot 1.4s infinite ease-in-out both' }}></span>
                <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'typing-dot 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'typing-dot 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 0 4px' }}>UpFilly Admin is typing...</span>
            </div>
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

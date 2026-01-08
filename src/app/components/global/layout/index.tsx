"use client";

import React, { useEffect, useState, useRef, useCallback, ReactNode, CSSProperties } from "react";
import "./style.scss";
import Sidebar from "../sidebar";
import Header from "../header";
import Header2 from "../header2/header2";
import Footer from "../footer";
import "react-toastify/dist/ReactToastify.css";
import ApiClient from "@/methods/api/apiClient";
import crendentialModel from "@/models/credential.model";
import { usePathname, useRouter } from "next/navigation";
import { requestForToken, message } from "../../../firebase/function";
import PageContainer from "../../main/PageContainer";
import axios from "axios";
import { ConnectSocket, SocketURL } from "@/app/chat/socket";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: string;
  senderId?: string;
}

interface User {
  id?: string;
  _id?: string;
  email?: string;
  isPayment?: boolean;
  role?: string;
}

interface SettingData {
  [key: string]: any;
}

interface LayoutProps {
  description?: string;
  children: ReactNode;
  title?: string;
  activeSidebar?: boolean;
  handleKeyPress?: (e: React.KeyboardEvent) => void;
  setFilter?: (filter: any) => void;
  reset?: () => void;
  filter?: any;
  name?: string;
  filters?: any;
  setActiveSidebar?: (active: boolean) => void;
}

export default function Layout({
  description,
  children,
  title,
  handleKeyPress,
  setFilter,
  reset,
  filter,
  name,
  filters,
}: LayoutProps) {
  const [user, setUser] = useState<User | null>(crendentialModel.getUser());
  const history = useRouter();
  const pathname = usePathname();
  const [settingData, setSettingData] = useState<SettingData[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [roomId, setRoomId] = useState("");
  const [adminId, setadminId] = useState("654227e78fd3b1018600710d");
  const [chat, setChat] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [incomingMessages, setIncomingMessages] = useState<Message[]>([]);
  const [onlineUserId, setOnlineUserId] = useState(null);
  
  const isDashboard =
    pathname.includes("/marketplace") ||
    pathname.includes("/notifications") ||
    pathname.includes("/requestcampaigns") ||
    pathname.includes("/mapping") ||
    pathname.includes("/reports") ||
    pathname.includes("/brand-report") ||
    pathname.includes("/affiliate-report") ||
    pathname.includes("/trackingdata") ||
    pathname.includes("/performance") ||
    pathname.includes("/creativeemails") ||
    pathname.includes("/emailmessages") ||
    pathname.includes("/productfeeds") ||
    pathname.includes("/creativeasset") ||
    pathname.includes("/emailtemplate") ||
    pathname.includes("/coupons") ||
    pathname.includes("/appliedjobs") ||
    pathname.includes("/applymerchants") ||
    pathname.includes("/invitedUsers") ||
    pathname.includes("/banners") ||
    pathname.includes("/invitations") ||
    pathname.includes("/inviteUsers") ||
    pathname.includes("/users") ||
    pathname.includes("/salestracking") ||
    pathname.includes("makeLink") ||
    pathname.includes("/generatelink") ||
    pathname.includes("/Trackings") ||
    pathname.includes("/invites") ||
    pathname.includes("/requests") ||
    pathname.includes("/addAccount/detail") ||
    pathname.includes("/offers") ||
    pathname.includes("/proposals") ||
    pathname.includes("/dashboard") ||
    pathname.includes("/campaign") ||
    pathname.includes("/campaignmanagement") ||
    pathname.includes("/affiliate") ||
    pathname.includes("/group") ||
    pathname.includes("/commission") ||
    pathname.includes("/payments") ||
    pathname.includes("/chat") ||
    pathname.includes("/allownotifications") ||
    pathname.includes("textlinks") ||
    pathname.includes("/overview");

  const isAuthenticate =
    pathname.includes("/reports") ||
    pathname.includes("/brand-report") ||
    pathname.includes("/affiliate-report") ||
    pathname.includes("/campaign") ||
    pathname.includes("/campaignmanagement") ||
    pathname.includes("/affiliate") ||
    pathname.includes("/profile") ||
    pathname.includes("/payments") ||
    pathname.includes("/proposals") ||
    pathname.includes("/commission");

  const loadChatMessages = useCallback((roomId: string, userId: string) => {
    if (!roomId) return;

    setLoadingMessages(true);
    axios
      .get(
        `${SocketURL}chat/user/message/all?room_id=${roomId}&user_id=${adminId}&login_user_id=${userId}`
      )
      .then((res) => {
        if (res?.data.success) {
          const chatData = res.data.data.data || [];
          setChat(chatData);

          // Convert API messages to Message format
          const formattedMessages: Message[] = chatData.map((msg: any, index: number) => ({
            id: index,
            text: msg.content || '',
            sender: msg.sender === userId ? 'user' : msg.sender === adminId ? 'admin' : 'bot',
            timestamp: msg.createdAt || new Date().toISOString(),
            senderId: msg.sender
          }));

          // Add welcome message if no previous messages
          if (formattedMessages.length === 0) {
            const welcomeMessage: Message = {
              id: Date.now(),
              text: user?.id
                ? `Hi ${user.email}! 👋 Welcome back to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`
                : `Hi there! 👋 Welcome to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`,
              sender: "bot",
              timestamp: new Date().toISOString(),
            };
            setMessages([welcomeMessage]);
          } else {
            setMessages(formattedMessages);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading chat messages:", err);
        // Add default welcome message on error
        const welcomeMessage: Message = {
          id: Date.now(),
          text: user?.id
            ? `Hi ${user.email}! 👋 Welcome back to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`
            : `Hi there! 👋 Welcome to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  }, [adminId, user]);

  // Combine messages and incomingMessages
  useEffect(() => {
    if (incomingMessages.length > 0) {
      const lastIncoming = incomingMessages[incomingMessages.length - 1];

      // Check if this message is already in messages
      const isDuplicate = messages.some(msg =>
        msg.text === lastIncoming.text &&
        msg.sender === lastIncoming.sender &&
        Math.abs(new Date(msg.timestamp).getTime() - new Date(lastIncoming.timestamp).getTime()) < 1000
      );

      if (!isDuplicate) {
        setMessages(prev => [...prev, lastIncoming]);
        setIsTyping(false); // Stop typing indicator when message arrives
      }
    }
  }, [incomingMessages]);

  // Clean up incomingMessages periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (incomingMessages.length > 20) {
        setIncomingMessages(prev => prev.slice(-10));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [incomingMessages]);

  // Socket listener for incoming messages
  useEffect(() => {
    const handleReceiveMessage = (newdata: any) => {
      console.log("Socket message received:", newdata);
      console.log("Current roomId in localStorage:", localStorage.getItem("chatbotroomId"));
      console.log("Message room_id:", newdata.data?._doc?.room_id);

      const data = newdata.data;
      const currentRoomId = localStorage.getItem("chatbotroomId");

      if (currentRoomId === data?._doc?.room_id) {
        console.log("Message belongs to current chat room");

        const currentUserId = user?.id || localStorage.getItem("chatbotuserId");
        const newMessage: Message = {
          id: Date.now(),
          text: data?._doc?.content || '',
          sender: data?._doc?.sender === adminId ? 'admin' :
            data?._doc?.sender === currentUserId ? 'user' : 'bot',
          timestamp: data?._doc?.createdAt || new Date().toISOString(),
          senderId: data?._doc?.sender
        };

        console.log("Adding new message to incomingMessages:", newMessage);
        setIncomingMessages(prev => [...prev, newMessage]);
      } else {
        console.log("Message belongs to different room, ignoring");
      }
    };

    ConnectSocket.on("receive-message", handleReceiveMessage);

    // Cleanup function
    return () => {
      ConnectSocket.off("receive-message", handleReceiveMessage);
    };
  }, [adminId, user?.id]);

    useEffect(() => {
    const handleReceiveMessage = (newdata: any) => {
      console.log("Socket message received:", newdata);
      console.log("Current roomId in localStorage:", localStorage.getItem("chatbotroomId"));
      console.log("Message room_id:", newdata.data?._doc?.room_id);

      const data = newdata.data;
      const currentRoomId = localStorage.getItem("chatbotroomId");

      if (currentRoomId === data?._doc?.room_id) {
        console.log("Message belongs to current chat room");

        const currentUserId = user?.id || localStorage.getItem("chatbotuserId");
        const newMessage: Message = {
          id: Date.now(),
          text: data?._doc?.content || '',
          sender: data?._doc?.sender === adminId ? 'admin' :
            data?._doc?.sender === currentUserId ? 'user' : 'bot',
          timestamp: data?._doc?.createdAt || new Date().toISOString(),
          senderId: data?._doc?.sender
        };

        console.log("Adding new message to incomingMessages:", newMessage);
        setIncomingMessages(prev => [...prev, newMessage]);
      } else {
        console.log("Message belongs to different room, ignoring");
      }
    };

    ConnectSocket.on("admin-offline-notification", handleReceiveMessage);

    // Cleanup function
    return () => {
      ConnectSocket.off("admin-offline-notification", handleReceiveMessage);
    };
  }, [adminId, user?.id]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('upfilly_chatbot_email');
    const savedMessages = localStorage.getItem('upfilly_chatbot_messages');

    const currentUser = crendentialModel.getUser();
    setUser(currentUser);

    if (currentUser?.id || currentUser?._id) {
      setEmail(currentUser.email || '');
      setEmailSubmitted(true);

      if (savedEmail) {
        localStorage.removeItem('upfilly_chatbot_email');
      }
    } else if (savedEmail) {
      setEmail(savedEmail);
      setEmailSubmitted(true);
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Error parsing saved messages:", e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('upfilly_chatbot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (user) {
      ApiClient.get("user/detail", { id: user.id }).then((res: any) => {
        if (res.success) {
          if (res?.data?.total_campaign == 0) {
            // setShow(true)
          }
          let data = { ...user, ...res.data };
          crendentialModel.setUser(data);
          localStorage.setItem("browseload", "true");
        }
      });
    }
  }, []);

  useEffect(() => {
    ApiClient.get("settings").then((res: any) => {
      if (res.success) {
        setSettingData(res?.data);
      }
    });
  }, []);

  useEffect(() => {
    requestForToken();
  }, []);

  useEffect(() => {
    message();
  }, []);

  useEffect(() => {
    if (isAuthenticate) {
      if (!user) {
        history.push("/login");
      }
    }
  }, [isAuthenticate, user, history]);

  useEffect(() => {
    if (isAuthenticate) {
      if (!user?.isPayment && user?.role == "brand") {
        history.push("/pricing");
      }
    }
  }, [isAuthenticate, user, history]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Chatbot Functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email && validateEmail(email)) {
      if (!user?.id) {
        localStorage.setItem('upfilly_chatbot_email', email);
      }

      setEmailSubmitted(true);
      setShowEmailModal(false);

      getData();
    }
  }, [email, user]);

  const getData = useCallback(() => {
    if (email) {
      let payload = {};

      if (user?._id) {
        payload = {
          email: user?.id,
          // chat_with: adminId,
        };
      } else {
        payload = {
          chat_by: email,
          // chat_with: adminId,
        };
      }

      axios.post(`${SocketURL}chat/user/join-group-bot`, payload).then((res) => {
        if (res?.data?.success) {
          const data = res.data;
          setRoomId(res.data.data.room_id);

          const userId = user?.id || res.data.data.user_id;
          loadChatMessages(data.data.room_id, userId);
          ConnectSocket.on("user-online", (data) => {
            // console.log(data,"daataaOnline")
            setOnlineUserId(userId);
          });
          joinRoom(data.data.room_id, data.data.user_id);
          localStorage.setItem("chatbotroomId", data.data.room_id);
          localStorage.setItem("chatbotuserId", data.data.user_id);
        }
      }).catch(err => {
        console.error("Error joining chat:", err);
        // Add default welcome message on error
        const welcomeMessage: Message = {
          id: Date.now(),
          text: user?.id
            ? `Hi ${user.email}! 👋 Welcome back to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`
            : `Hi there! 👋 Welcome to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      });
    }
  }, [email, user, adminId, loadChatMessages]);

  const userMessage = (roomuid: any, u_id: any) => {
    axios
      .get(
        `${SocketURL}chat/user/message/all?room_id=${roomuid}&user_id=${adminId}&login_user_id=${user?.id || u_id}`
      )
      .then((res) => {
        if (res?.data.success) {
          setChat(res.data.data.data);
        }
      });
  };

  const joinRoom = (jId: any, uId: any) => {
    const payload = {
      room_id: jId,
      user_id: user && user.id || uId,
    };
    ConnectSocket.emit("join-room", payload);
  };

  const handleChatButtonClick = useCallback(() => {
    if (user?.id || user?._id) {
      if (!emailSubmitted) {
        setEmail(user.email || '');
        setEmailSubmitted(true);
      }
      getData();
      setShowChatbot(true);
      return;
    }

    if (emailSubmitted) {
      getData();
      setShowChatbot(true);
      return;
    }

    setShowEmailModal(true);
  }, [user, emailSubmitted, getData]);

  const clearChatHistory = useCallback(() => {
    setMessages([]);
    setIncomingMessages([]);
    localStorage.removeItem('upfilly_chatbot_messages');
  }, []);

  const handleCloseChatbot = useCallback(() => {
    setShowChatbot(false);
  }, []);

  const logo = () => {
    return "/assets/img/logo.png";
  };

  const router = () => {
    let route = localStorage.getItem("route");
    history.push(route || "/");
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const ChatButton = useCallback(() => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
      if (user?.id || user?._id || emailSubmitted) {
        setShowChatbot(prev => !prev);
      }

      if (!showChatbot) {
        if (user?.id || user?._id) {
          if (!emailSubmitted) {
            setEmail(user.email || '');
            setEmailSubmitted(true);
          }
          getData();
          return;
        }

        if (emailSubmitted) {
          getData();
          return;
        }

        
        setShowEmailModal(true);
      }
    };

    return (
      <div
        style={{
          position: 'fixed',
          bottom: "28px",
          right: "20px",
          zIndex: 1000,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '0',
              backgroundColor: '#333',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 1001,
            }}
          >
            Upfilly Support 
            {/* Tooltip arrow */}
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              right: '12px',
              width: '0',
              height: '0',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #333',
            }} />
          </div>
        )}

        {/* Chat Button */}
        <button
          onClick={handleClick}
          className="chatbot-button"
          style={{
            backgroundColor: showChatbot ? '#0056b3' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            position: 'relative',
          }}
          aria-label={showChatbot ? "Close chat support" : "Open chat support"}
        >
          {showChatbot ? '×' : '💬'}
        </button>
      </div>
    );
  }, [showChatbot, user, emailSubmitted, getData]);

  // Add hover effect styles to the existing ChatbotStyles component
  const ChatbotStyles = () => (
    <style jsx global>{`
    /* ... existing styles ... */
    
    .chatbot-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.25);
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
      }
    }
    
    /* Tooltip animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* ... rest of the existing styles ... */
  `}</style>
  );

  const EmailModal = useCallback(() => {
    const emailInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (showEmailModal && emailInputRef.current) {
        setTimeout(() => {
          emailInputRef.current?.focus();
        }, 100);
      }
    }, [showEmailModal]);

    if (!showEmailModal || user?.id || emailSubmitted) return null;

    const handleModalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (email && validateEmail(email)) {
        handleEmailSubmit(e);
      }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };

    const handleMaybeLater = () => {
      setShowEmailModal(false);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        handleMaybeLater();
      }
    };

    const modalOverlayStyle: CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1002,
      backdropFilter: 'blur(3px)'
    };

    const modalContentStyle: CSSProperties = {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '16px',
      maxWidth: '450px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    };

    return (
      <div
        className="email-modal-overlay"
        style={modalOverlayStyle}
        onClick={handleOverlayClick}
      >
        <div
          className="email-modal-content"
          style={modalContentStyle}
        >
          <div style={{ marginBottom: '25px' }}>
            <div style={{
              backgroundColor: '#007bff',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'white',
              fontSize: '28px'
            }}>
              ✉️
            </div>
            <h3 style={{
              marginBottom: '10px',
              color: '#333',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              Welcome to Upfilly Support
            </h3>
            <p style={{
              marginBottom: '25px',
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Please enter your email address to start chatting with our support team.
            </p>
          </div>

          <form onSubmit={handleModalSubmit}>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your.email@example.com"
              required
              style={{
                width: '100%',
                padding: '14px 20px',
                marginBottom: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: '#333',
                caretColor: '#007bff'
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Start Chat
              </button>
              <button
                type="button"
                onClick={handleMaybeLater}
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  color: '#666',
                  border: '2px solid #e0e0e0',
                  padding: '14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Maybe Later
              </button>
            </div>
          </form>

          <p style={{
            fontSize: '13px',
            color: '#999',
            marginTop: '25px',
            lineHeight: '1.5'
          }}>
            By continuing, you agree to our <a href="/terms" style={{ color: '#007bff', textDecoration: 'none' }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#007bff', textDecoration: 'none' }}>Privacy Policy</a>. We'll use your email only to provide support.
          </p>
        </div>
      </div>
    );
  }, [showEmailModal, email, user?.id, emailSubmitted, handleEmailSubmit]);

  const ChatbotWindow = useCallback(() => {
    if (!showChatbot) return null;

    const shouldShowEmailInput = !emailSubmitted && !user?.id;
    const messageInputRef = useRef<HTMLInputElement>(null);

    // Local state for input message
    const [localInputMessage, setLocalInputMessage] = useState(inputMessage || "");

    // Update local input when prop changes
    useEffect(() => {
      setLocalInputMessage(inputMessage);
    }, [inputMessage]);

    // Focus input when chatbot opens
    useEffect(() => {
      if (showChatbot && messageInputRef.current && !shouldShowEmailInput) {
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 100);
      }
    }, [showChatbot, shouldShowEmailInput]);

    // Key handler for Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleLocalSendMessage(e);
      }
    };

    const handleLocalSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!localInputMessage.trim() || !roomId) return;

      // Add user message immediately for better UX
      const userMessage: Message = {
        id: Date.now(),
        text: localInputMessage,
        sender: "user" as const,
        timestamp: new Date().toISOString(),
        senderId: user?.id || localStorage.getItem("chatbotuserId") || ''
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setLocalInputMessage(""); // Clear local state
      // setIsTyping(true);

      // Send message via Socket.io
      const payload = {
        content: localInputMessage,
        room_id: roomId,
        user_id: user?.id || localStorage.getItem("chatbotuserId"),
        reciver_id: adminId,
        type: "TEXT"
      };

      console.log("Sending message via socket:", payload);
      ConnectSocket.emit("send-message", payload);

      // Fallback timeout in case socket doesn't respond
      // const fallbackTimeout = setTimeout(() => {
      //   setIsTyping(false);
      //   const fallbackMessage: Message = {
      //     id: Date.now() + 1,
      //     text: "Thanks for your message! Our support team has received it and will respond shortly.",
      //     sender: "admin",
      //     timestamp: new Date().toISOString(),
      //   };
      //   setMessages(prev => [...prev, fallbackMessage]);
      // }, 10000);

      // Store timeout ID to clear it if real response arrives
      // const timeoutId = fallbackTimeout;

      // Clear timeout when component unmounts or new message is sent
      // return () => clearTimeout(timeoutId);
    };

    const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalInputMessage(value);
      setInputMessage(value);
    };

    const chatbotWindowStyle: CSSProperties = {
      position: 'fixed',
      bottom: "100px",
      right: "30px",
      width: '350px',
      maxWidth: 'calc(100vw - 40px)',
      height: '500px',
      maxHeight: 'calc(100vh - 120px)',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #e0e0e0'
    };

    // Input styles with explicit color and visibility properties
    const inputStyle: CSSProperties = {
      flex: 1,
      padding: '10px 14px',
      border: '1px solid #e0e0e0',
      borderRadius: '20px',
      fontSize: '13px',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      color: '#333',
      caretColor: '#007bff',
      opacity: 1,
      WebkitAppearance: 'none',
      MozAppearance: 'textfield',
    };

    const inputFocusStyle: CSSProperties = {
      ...inputStyle,
      borderColor: '#007bff',
      boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.1)',
    };

    const [currentInputStyle, setCurrentInputStyle] = useState(inputStyle);

    const handleInputFocus = () => {
      setCurrentInputStyle(inputFocusStyle);
    };

    const handleInputBlur = () => {
      setCurrentInputStyle(inputStyle);
    };

    return (
      <div
        className="chatbot-window"
        style={chatbotWindowStyle}
      >
        {/* Header */}
        <div style={{
          padding: '15px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              minHeight: '36px',
              minWidth: '36px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#007bff',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              U
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Upfilly  Support</h4>
              <small style={{ opacity: 0.9, fontSize: '11px' }}>Online • Typically replies in minutes</small>
            </div>
          </div>
          <button
            onClick={handleCloseChatbot}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        {/* Messages Area */}
        <div
          className="chatbot-messages"
          style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}
        >
          {shouldShowEmailInput ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>👋</div>
              <h5 style={{ marginBottom: '10px', fontSize: '16px' }}>Welcome to Upfilly Support</h5>
              <p>Please enter your email to start chatting</p>
            </div>
          ) : loadingMessages ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#666'
            }}>
              <div className="typing-indicator" style={{ justifyContent: 'center' }}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
              <h5 style={{ marginBottom: '10px', fontSize: '16px' }}>
                {user?.id ? `Hi ${user.email}!` : 'Hi there!'}
              </h5>
              <p>How can I help you with Upfilly today?</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}
                >
                  {message.sender !== 'user' && (
                    <div style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: message.sender === 'admin' ? '#28a745' : '#007bff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {message.sender === 'admin' ? 'A' : 'U'}
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: '16px',
                      backgroundColor: message.sender === 'user' ? '#007bff' :
                        message.sender === 'admin' ? '#e7f5e9' : 'white',
                      color: message.sender === 'user' ? 'white' : '#333',
                      boxShadow: message.sender === 'user'
                        ? '0 2px 5px rgba(0,123,255,0.2)'
                        : '0 2px 5px rgba(0,0,0,0.1)',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line',
                      fontSize: '14px'
                    }}
                  >
                    {message.text}
                    <div style={{
                      fontSize: '10px',
                      opacity: 0.7,
                      marginTop: '4px',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#007bff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    U
                  </div>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '16px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="typing-indicator">
                      <span style={{ animation: 'typing 1.4s infinite' }}>.</span>
                      <span style={{ animation: 'typing 1.4s infinite 0.2s' }}>.</span>
                      <span style={{ animation: 'typing 1.4s infinite 0.4s' }}>.</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        {!shouldShowEmailInput && !loadingMessages && (
          <div style={{
            padding: '12px 15px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'white'
          }}>
            <form onSubmit={handleLocalSendMessage} style={{ display: 'flex', gap: '4px' }}>
              <input
                ref={messageInputRef}
                type="text"
                value={localInputMessage}
                onChange={handleLocalInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Type your message..."
                style={currentInputStyle}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!localInputMessage.trim() || isTyping}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  minHeight: '40px',
                  minWidth: '40px',
                  width: '40px',
                  height: '40px',
                  cursor: localInputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: localInputMessage.trim() && !isTyping ? 1 : 0.5,
                  transition: 'all 0.3s',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  if (localInputMessage.trim() && !isTyping) {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#007bff';
                }}
                aria-label="Send message"
              >
                →
              </button>
            </form>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px',
              fontSize: '11px',
              color: '#999'
            }}>
              <span>
                {user?.id
                  ? `Chatting as: ${user.email}`
                  : `Chatting as: ${email}`}
              </span>
              <button
                onClick={clearChatHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '11px',
                  textDecoration: 'underline'
                }}
              >
                Clear chat
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }, [showChatbot, emailSubmitted, user, email, messages, isTyping, inputMessage, loadingMessages, roomId, adminId, clearChatHistory, handleCloseChatbot]);

  return (
    <>
      <PageContainer
        title={title}
        description={description}
        settingData={settingData}
      >
        <ChatbotStyles />
        <div>
          <div onClick={(e) => router()} id="routerDiv"></div>
          {(!user || !isDashboard) && (
            <Header setShowPopup={setShowPopup} settingData={settingData} />
          )}

          {isDashboard ? (
            <div
              className={
                !activeSidebar ? "sidebar_main" : "sidebar_main active"
              }
            >
              <div className="left_sidebar">
                <Sidebar
                  setActiveSidebar={setActiveSidebar}
                  activeSidebar={activeSidebar}
                />
              </div>
              <div className="layout_right">
                <Header2
                  settingData={settingData}
                  handleKeyPress={handleKeyPress}
                  setFilter={setFilter}
                  reset={reset}
                  filter={filter}
                  name={name}
                  filters={filters}
                />
                {children}
              </div>
            </div>
          ) : (
            <span>{children}</span>
          )}

          {/* Chatbot Components - Added here */}
          <ChatButton />
          <ChatbotWindow />
          <EmailModal />

          {!isDashboard && <Footer settingData={settingData} />}
        </div>
      </PageContainer>
    </>
  );
}
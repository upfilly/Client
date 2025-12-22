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

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface User {
  id?: string;
  _id?: string;
  email?: string;
  isPayment?: boolean;
  role?: string;
}

interface SettingData {
  // Define the structure of settingData based on your API response
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
  activeSidebar = false,
  handleKeyPress,
  setFilter,
  reset,
  filter,
  name,
  filters,
  setActiveSidebar
}: LayoutProps) {
  const [user, setUser] = useState<User | null>(crendentialModel.getUser());
  const history = useRouter();
  const pathname = usePathname();
  const [settingData, setSettingData] = useState<SettingData[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      ApiClient.post("chatbot/register-email", {
        email,
        user_id: user?.id || 'guest',
        page: "home",
        timestamp: new Date().toISOString()
      }).catch((err: Error) => {
        console.error("Error saving email:", err);
      });

      const welcomeMessage: Message = {
        id: Date.now(),
        text: user?.id
          ? `Hi ${user.email}! 👋 Welcome back to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`
          : `Hi there! 👋 Welcome to Upfilly support. I'm here to help you with any questions about our affiliate marketing platform. How can I assist you today?`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages([welcomeMessage]);
    }
  }, [email, user]);

  const handleChatButtonClick = useCallback(() => {
    // If user is logged in with ID, don't ask for email
    if (user?.id || user?._id) {
      if (!emailSubmitted) {
        setEmail(user.email || '');
        setEmailSubmitted(true);
      }
      setShowChatbot(true);
      return;
    }

    // For non-logged in users, check if email was previously submitted
    if (emailSubmitted) {
      setShowChatbot(true);
      return;
    }

    // Show email modal for non-logged in users without saved email
    setShowEmailModal(true);
  }, [user, emailSubmitted]);

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Prepare bot response based on user input
    setTimeout(() => {
      let botResponse = "";
      const userMessageLower = inputMessage.toLowerCase();

      if (userMessageLower.includes("pricing") || userMessageLower.includes("cost") || userMessageLower.includes("price")) {
        botResponse = "We offer flexible pricing plans for both merchants and affiliates. You can check our detailed pricing at: https://yourwebsite.com/pricing or I can have a sales representative contact you.";
      } else if (userMessageLower.includes("demo") || userMessageLower.includes("meeting") || userMessageLower.includes("schedule")) {
        botResponse = "Great! You can schedule a demo with our team at: https://yourwebsite.com/demo. What's the best time for you?";
      } else if (userMessageLower.includes("affiliate") && userMessageLower.includes("signup")) {
        botResponse = "Affiliates can sign up here: https://yourwebsite.com/track/signup/affiliate. Merchants can start here: https://yourwebsite.com/merchant.";
      } else if (userMessageLower.includes("support") || userMessageLower.includes("help")) {
        botResponse = "For immediate support, you can email us at support@upfilly.com or check our FAQ section. What specific issue can I help you with?";
      } else if (userMessageLower.includes("feature") || userMessageLower.includes("how does it work")) {
        botResponse = "Upfilly offers real-time tracking, automated payouts, Shopify integration, and managed program options. Would you like more details about any specific feature?";
      } else if (userMessageLower.includes("contact") || userMessageLower.includes("phone") || userMessageLower.includes("email")) {
        botResponse = "You can reach us at:\n📧 Email: support@upfilly.com\n🌐 Website: https://upfilly.com\n📞 Phone: +1 (555) 123-4567\n⏰ Hours: Mon-Fri, 9AM-6PM EST";
      } else {
        // Default response
        const defaultResponses = [
          "I understand you're asking about: " + inputMessage + ". Our team can help with that. Would you like me to connect you with a specialist?",
          "Thank you for your question! Our support team will get back to you within 24 hours. In the meantime, you can check our FAQ section for similar questions.",
          "I'll help you with that. For detailed assistance, please email support@upfilly.com with your query and we'll respond promptly.",
          "Great question! Let me connect you with a specialist who can provide detailed information about this. What's the best email to contact you?",
          "I've noted your question. Our team typically responds within a few hours. You can also visit our help center at: https://help.upfilly.com"
        ];
        botResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  }, [inputMessage]);

  const clearChatHistory = useCallback(() => {
    setMessages([]);
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

  const ChatButton = useCallback(() => (
    <button
      onClick={handleChatButtonClick}
      className="chatbot-button"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        fontSize: '24px',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      }}
      aria-label="Open chat support"
    >
      💬
    </button>
  ), [handleChatButtonClick]);

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
                backgroundColor: 'white'
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

    // If user has ID, they should already have emailSubmitted = true
    // For non-logged in users, check emailSubmitted
    const shouldShowEmailInput = !emailSubmitted && !user?.id;

    // Use ref for the input to maintain focus
    const messageInputRef = useRef<HTMLInputElement>(null);

    // Local state for input message within the component
    const [localInputMessage, setLocalInputMessage] = useState("");

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

    const handleLocalSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!localInputMessage.trim()) return;

      // Add user message
      const userMessage: Message = {
        id: Date.now(),
        text: localInputMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setLocalInputMessage("");
      setIsTyping(true);

      // Prepare bot response based on user input
      setTimeout(() => {
        let botResponse = "";
        const userMessageLower = localInputMessage.toLowerCase();

        if (userMessageLower.includes("pricing") || userMessageLower.includes("cost") || userMessageLower.includes("price")) {
          botResponse = "We offer flexible pricing plans for both merchants and affiliates. You can check our detailed pricing at: https://yourwebsite.com/pricing or I can have a sales representative contact you.";
        } else if (userMessageLower.includes("demo") || userMessageLower.includes("meeting") || userMessageLower.includes("schedule")) {
          botResponse = "Great! You can schedule a demo with our team at: https://yourwebsite.com/demo. What's the best time for you?";
        } else if (userMessageLower.includes("affiliate") && userMessageLower.includes("signup")) {
          botResponse = "Affiliates can sign up here: https://yourwebsite.com/track/signup/affiliate. Merchants can start here: https://yourwebsite.com/merchant.";
        } else if (userMessageLower.includes("support") || userMessageLower.includes("help")) {
          botResponse = "For immediate support, you can email us at support@upfilly.com or check our FAQ section. What specific issue can I help you with?";
        } else if (userMessageLower.includes("feature") || userMessageLower.includes("how does it work")) {
          botResponse = "Upfilly offers real-time tracking, automated payouts, Shopify integration, and managed program options. Would you like more details about any specific feature?";
        } else if (userMessageLower.includes("contact") || userMessageLower.includes("phone") || userMessageLower.includes("email")) {
          botResponse = "You can reach us at:\n📧 Email: support@upfilly.com\n🌐 Website: https://upfilly.com\n📞 Phone: +1 (555) 123-4567\n⏰ Hours: Mon-Fri, 9AM-6PM EST";
        } else {
          // Default response
          const defaultResponses = [
            "I understand you're asking about: " + localInputMessage + ". Our team can help with that. Would you like me to connect you with a specialist?",
            "Thank you for your question! Our support team will get back to you within 24 hours. In the meantime, you can check our FAQ section for similar questions.",
            "I'll help you with that. For detailed assistance, please email support@upfilly.com with your query and we'll respond promptly.",
            "Great question! Let me connect you with a specialist who can provide detailed information about this. What's the best email to contact you?",
            "I've noted your question. Our team typically responds within a few hours. You can also visit our help center at: https://help.upfilly.com"
          ];
          botResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        const botMessage: Message = {
          id: Date.now() + 1,
          text: botResponse,
          sender: "bot",
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // Refocus input after bot response
        setTimeout(() => {
          messageInputRef.current?.focus();
        }, 100);
      }, 1000);
    };

    const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalInputMessage(e.target.value);
      setInputMessage(e.target.value);
    };

    const handleSuggestionClick = (suggestion: string) => {
      setLocalInputMessage(suggestion);
      setInputMessage(suggestion);
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 50);
    };

    const chatbotWindowStyle: CSSProperties = {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      width: '380px',
      maxWidth: 'calc(100vw - 60px)',
      height: '500px',
      maxHeight: 'calc(100vh - 150px)',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid #e0e0e0'
    };

    return (
      <div
        className="chatbot-window"
        style={chatbotWindowStyle}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#007bff',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              U
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px' }}>Upfilly Support</h4>
              <small style={{ opacity: 0.9 }}>Online • Typically replies in minutes</small>
            </div>
          </div>
          <button
            onClick={handleCloseChatbot}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px',
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
            padding: '20px',
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
              <h5 style={{ marginBottom: '10px' }}>Welcome to Upfilly Support</h5>
              <p>Please enter your email to start chatting</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
              <h5 style={{ marginBottom: '10px' }}>
                {user?.id ? `Hi ${user.email}!` : 'Hi there!'}
              </h5>
              <p>How can I help you with Upfilly today?</p>
              <div style={{ marginTop: '30px', textAlign: 'left' }}>
                <p style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>Try asking:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => handleSuggestionClick("Tell me about pricing")}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px 15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      e.currentTarget.style.borderColor = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    💰 Tell me about pricing
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("How do I sign up as an affiliate?")}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px 15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      e.currentTarget.style.borderColor = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    📝 How do I sign up as an affiliate?
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Schedule a demo")}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px 15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      e.currentTarget.style.borderColor = '#007bff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    🗓️ Schedule a demo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '15px',
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}
                >
                  {message.sender === 'bot' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#007bff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      U
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      backgroundColor: message.sender === 'user' ? '#007bff' : 'white',
                      color: message.sender === 'user' ? 'white' : '#333',
                      boxShadow: message.sender === 'user'
                        ? '0 2px 5px rgba(0,123,255,0.2)'
                        : '0 2px 5px rgba(0,0,0,0.1)',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {message.text}
                    <div style={{
                      fontSize: '11px',
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
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#007bff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    U
                  </div>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '18px',
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
        {!shouldShowEmailInput && (
          <div style={{
            padding: '15px 20px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'white'
          }}>
            <form onSubmit={handleLocalSendMessage} style={{ display: 'flex', gap: '10px' }}>
              <input
                ref={messageInputRef}
                type="text"
                value={localInputMessage}
                onChange={handleLocalInputChange}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '24px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
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
                  width: '44px',
                  height: '44px',
                  cursor: localInputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: localInputMessage.trim() && !isTyping ? 1 : 0.5,
                  transition: 'all 0.3s'
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
                </svg>
              </button>
            </form>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '12px',
              color: '#999'
            }}>
              <span>
                {user?.id
                  ? `Chatting as: ${user.email} (Logged in)`
                  : `Chatting as: ${email}`}
              </span>
              <button
                onClick={clearChatHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '12px',
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
  }, [showChatbot, emailSubmitted, user, email, messages, isTyping, inputMessage, clearChatHistory, handleCloseChatbot]);

  // Add CSS animations
  const ChatbotStyles = () => (
    <style jsx global>{`
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes typing {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-5px);
        }
      }
      
      .typing-indicator {
        display: flex;
        gap: 4px;
      }
      
      .typing-indicator span {
        display: inline-block;
        width: 6px;
        height: 6px;
        background-color: #999;
        border-radius: 50%;
      }
      
      .chatbot-button:hover {
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
          boxShadow: 0 0 0 0 rgba(0, 123, 255, 0);
        }
      }
      
      /* Scrollbar styling for messages */
      .chatbot-messages::-webkit-scrollbar {
        width: 6px;
      }
      
      .chatbot-messages::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }
      
      .chatbot-messages::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
      }
      
      .chatbot-messages::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
      
      /* Prevent input blinking */
      .email-modal-content input {
        caret-color: #007bff;
      }
      
      .email-modal-content input:focus {
        border-color: #007bff !important;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1) !important;
      }
    `}</style>
  );

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
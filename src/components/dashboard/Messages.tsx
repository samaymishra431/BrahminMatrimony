import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FullImageViewer from "@/components/common/FullImageViewer";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import { SubscriptionModal } from "@/components/common/SubscriptionModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://10.11.177.197:9099";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [profileImages, setProfileImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const typingTimerRef = useRef(null);
  const processedMessageIds = useRef(new Set());
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const selectedConversationRef = useRef(null);

  // Context menu
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    messageIndex: null,
    message: null,
  });

  // Get token from session storage
  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  // Parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  };

  // Load current user from token
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setCurrentUser({
          id: decoded.id,
          username: decoded.sub,
          email: decoded.email
        });
      }
    }
  }, []);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/subscriptions/hasActiveSubscription`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHasActiveSubscription(data.payload);
          if (!data.payload) {
            setShowSubscriptionModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setSubscriptionChecked(true);
      }
    };

    checkSubscription();
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    if (!currentUser) return;

    const token = getToken();
    if (!token) return;

    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const client = Stomp.over(socket);
    
    stompClientRef.current = client;

    client.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        console.log('✅ Connected to WebSocket');
        setConnectionStatus("connected");
        setStompClient(client);

        // Subscribe to personal messages
        client.subscribe(`/topic/user/${currentUser.id}`, (message) => {
          try {
            const payload = JSON.parse(message.body);
            console.log('📨 Received message:', payload);
            handleIncomingMessage(payload);
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        });

        // Subscribe to typing indicators
        client.subscribe(`/topic/typing/${currentUser.id}`, (message) => {
          try {
            const payload = JSON.parse(message.body);
            handleTypingIndicator(payload);
          } catch (e) {
            console.error('Error parsing typing indicator:', e);
          }
        });

        loadConnections();
      },
      (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus("disconnected");
      }
    );

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && selectedConversation) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedConversation]);

  // Load conversations with unread counts
  const loadConnections = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const users = data.payload || [];
        const conversationsList = users.map(user => ({
          id: user.id,
          name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username,
          username: user.username,
          occupation: user.occupation || "User",
          time: "Active",
          unread: user.unreadCount || 0,
          status: "Online",
          profileId: user.profileId
        }));
        
        setConversations(conversationsList);
        
        // Load profile images for all users
        conversationsList.forEach(conv => {
          if (conv.profileId) {
            loadProfileImage(conv.profileId);
          }
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading connections:', error);
      setIsLoading(false);
    }
  };

  // Load profile image
  const loadProfileImage = async (profileId) => {
    if (!profileId || profileImages[profileId] || loadingImages[profileId]) return;
    
    setLoadingImages(prev => ({ ...prev, [profileId]: true }));
    
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/images/getUserProfileImageById/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfileImages(prev => ({ ...prev, [profileId]: imageUrl }));
      } else {
        // Image not found, will use fallback avatar
        setProfileImages(prev => ({ ...prev, [profileId]: null }));
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
      setProfileImages(prev => ({ ...prev, [profileId]: null }));
    } finally {
      setLoadingImages(prev => ({ ...prev, [profileId]: false }));
    }
  };

  // Load conversation history
  const loadConversationHistory = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/messages/conversation/${userId}?page=0&size=50`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const msgs = data.payload || [];
        
        // Create unique messages with their IDs tracked
        const uniqueMessages = msgs.reverse().map(msg => {
          if (msg.id) {
            processedMessageIds.current.add(msg.id);
          }
          return {
            text: msg.content,
            time: new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSent: msg.senderId === currentUser.id,
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderName
          };
        });
        
        setMessages(prev => ({
          ...prev,
          [userId]: uniqueMessages
        }));

        // Mark messages as read
        msgs.forEach(msg => {
          if (msg.senderId !== currentUser.id && msg.id) {
            markAsRead(msg.id);
          }
        });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      const token = getToken();
      await fetch(`${API_BASE_URL}/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Handle incoming message
  const handleIncomingMessage = (payload) => {
    console.log('🔍 Processing incoming message:', payload);
    console.log('🔍 Current state - selectedConversation:', selectedConversationRef.current, 'currentUser.id:', currentUser?.id);
    
    if (!payload.senderId || !payload.content) {
      console.log('❌ Invalid message format');
      return;
    }

    // Check for duplicate messages
    if (payload.id && processedMessageIds.current.has(payload.id)) {
      console.log('⏭️ Duplicate message, skipping');
      return;
    }

    if (payload.id) {
      processedMessageIds.current.add(payload.id);
      setTimeout(() => processedMessageIds.current.delete(payload.id), 60000);
    }

    const isSentByMe = payload.senderId === currentUser.id;
    console.log('isSentByMe:', isSentByMe, 'senderId:', payload.senderId, 'currentUserId:', currentUser.id);
    
    const otherUserId = isSentByMe ? payload.receiverId : payload.senderId;
    console.log('selectedConversationRef.current:', selectedConversationRef.current, 'otherUserId:', otherUserId, 'match:', selectedConversationRef.current === otherUserId);

    // If this message is for the currently active chat
    if (selectedConversationRef.current && selectedConversationRef.current === otherUserId) {
      console.log('✅ Adding message to active chat for userId:', otherUserId);
      
      const newMessage = {
        text: payload.content,
        time: new Date(payload.sentAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: isSentByMe,
        id: payload.id,
        senderId: payload.senderId,
        senderName: payload.senderName
      };

      setMessages(prev => {
        const currentMessages = prev[otherUserId] || [];
        console.log('📝 Current messages count:', currentMessages.length);
        
        // Check if message already exists
        const exists = currentMessages.some(msg => msg.id === payload.id);
        if (exists) {
          console.log('Message already exists in state');
          return prev;
        }
        
        // Remove temporary message if this is sent by me
        const filteredMessages = isSentByMe 
          ? currentMessages.filter(msg => !msg.isTemporary)
          : currentMessages;
        
        console.log('✅ Adding new message, new count:', filteredMessages.length + 1);
        
        return {
          ...prev,
          [otherUserId]: [...filteredMessages, newMessage]
        };
      });

      // Mark as read only if message is from other user
      if (payload.id && !isSentByMe) {
        markAsRead(payload.id);
      }
    } else if (!isSentByMe) {
      console.log('📬 Message for inactive chat, updating unread count for userId:', otherUserId);
      // Update unread count for other conversations only if message is from other user
      setConversations(prev =>
        prev.map(conv =>
          conv.id === otherUserId ? { ...conv, unread: (conv.unread || 0) + 1 } : conv
        )
      );
    } else {
      console.log('⏭️ Skipping message - sent by me but not for active chat');
    }
  };

  // Handle typing indicator
  const handleTypingIndicator = (payload) => {
    if (payload.senderId === selectedConversationRef.current) {
      if (payload.type === 'TYPING_START') {
        setTypingUsers(prev => ({ ...prev, [payload.senderId]: payload.senderName || 'User' }));
      } else if (payload.type === 'TYPING_STOP') {
        setTypingUsers(prev => {
          const updated = { ...prev };
          delete updated[payload.senderId];
          return updated;
        });
      }
    }
  };

  // Send typing indicator
  const sendTypingIndicator = (isTyping) => {
    if (!stompClientRef.current || !stompClientRef.current.connected || !selectedConversation) return;

    const token = getToken();
    const payload = {
      receiverId: selectedConversation,
      type: isTyping ? 'TYPING_START' : 'TYPING_STOP',
      senderId: currentUser.id,
      senderName: currentUser.username,
      token: `Bearer ${token}`
    };

    stompClientRef.current.send('/app/chat.typing', {}, JSON.stringify(payload));
  };

  // Send message
  const sendMessage = () => {
    const text = messageInput.trim();
    if (!text || !selectedConversation) return;

    sendTypingIndicator(false);

    const token = getToken();
    const payload = {
      receiverId: selectedConversation,
      content: text,
      messageType: 'TEXT',
      token: `Bearer ${token}`
    };

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.send('/app/chat.sendMessage', {}, JSON.stringify(payload));

      const tempMessage = {
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
        isTemporary: true
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), tempMessage]
      }));

      setMessageInput('');
    }
  };

  // Handle conversation click
  const handleConversationClick = (id) => {
    if (subscriptionChecked && !hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }

    setSelectedConversation(id);
    selectedConversationRef.current = id; // Update ref immediately
    setShowChat(true);
    loadConversationHistory(id);

    // Reset unread count when opening conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, unread: 0 } : conv
      )
    );
  };

  // Handle input change
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    if (e.target.value.trim().length > 0) {
      sendTypingIndicator(true);
    }

    typingTimerRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 1000);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedConversation(null);
    selectedConversationRef.current = null; // Clear ref when going back
  };

  const openFullImage = (url) => {
    setSelectedImageUrl(url);
    setImageViewerOpen(true);
  };

  const deleteForMe = async (index) => {
    if (!selectedConversation) return;

    const message = messages[selectedConversation][index];
    if (!message.id) {
      console.error('Message ID not found');
      closeContextMenu();
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/messages/${message.id}/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessages(prev => ({
          ...prev,
          [selectedConversation]: prev[selectedConversation].map((msg, i) =>
            i === index ? { ...msg, deletedForMe: true } : msg
          ),
        }));
      } else {
        const errorData = await response.json();
        console.error('Error deleting message:', errorData.message);
        alert(errorData.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }

    closeContextMenu();
  };

  const deleteForEveryone = async (index) => {
    if (!selectedConversation) return;

    const message = messages[selectedConversation][index];
    if (!message.id) {
      console.error('Message ID not found');
      closeContextMenu();
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/messages/${message.id}/everyone`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessages(prev => ({
          ...prev,
          [selectedConversation]: prev[selectedConversation].map((msg, i) =>
            i === index ? { ...msg, deletedForEveryone: true, text: "" } : msg
          ),
        }));
      } else {
        const errorData = await response.json();
        console.error('Error deleting message:', errorData.message);
        alert(errorData.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }

    closeContextMenu();
  };

  const openContextMenu = (event, index, msg) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const menuWidth = 160; // Width of context menu
    const menuHeight = msg.isSent ? 80 : 50; // Height varies based on options

    // Calculate position to keep menu within viewport
    let x = rect.right + 10;
    let y = rect.top;

    // If menu would go off right edge, position it to the left of the button
    if (x + menuWidth > windowWidth) {
      x = rect.left - menuWidth - 10;
    }

    // If menu would go off bottom edge, position it higher
    if (y + menuHeight > windowHeight) {
      y = windowHeight - menuHeight - 10;
    }

    // Ensure menu doesn't go off top edge
    if (y < 10) {
      y = 10;
    }

    // Ensure menu doesn't go off left edge
    if (x < 10) {
      x = 10;
    }

    setContextMenu({
      x: x,
      y: y,
      messageIndex: index,
      message: msg,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ x: 0, y: 0, messageIndex: null, message: null });
  };

  const currentConversation = selectedConversation
    ? conversations.find((c) => c.id === selectedConversation)
    : null;

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total unread count from conversations
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden" onClick={closeContextMenu}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* LEFT - Conversations List */}
        <Card
          className={`lg:col-span-1 p-4 flex flex-col border-0 shadow-medium h-full overflow-hidden ${
            showChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="mb-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {totalUnreadCount > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                {totalUnreadCount} unread message{totalUnreadCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const profileImage = profileImages[conversation.profileId];
                const isLoadingImage = loadingImages[conversation.profileId];

                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedConversation === conversation.id
                        ? "bg-primary/10 shadow-sm"
                        : "hover:bg-muted"
                    } ${subscriptionChecked && !hasActiveSubscription ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {isLoadingImage ? (
                        <div className="w-12 h-12 border-2 border-primary rounded-full flex-shrink-0 animate-pulse bg-muted" />
                      ) : (
                        <Avatar
                          className="w-12 h-12 border-2 border-primary flex-shrink-0 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (subscriptionChecked && !hasActiveSubscription) {
                              setShowSubscriptionModal(true);
                              return;
                            }
                            if (profileImage) {
                              openFullImage(profileImage);
                            }
                          }}
                        >
                          {profileImage ? (
                            <AvatarImage src={profileImage} />
                          ) : (
                            <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
                          )}
                        </Avatar>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold truncate">{conversation.name}</p>
                          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                            {conversation.time}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.occupation}
                          </p>

                          {conversation.unread > 0 && (
                            <span className="inline-flex w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] items-center justify-center flex-shrink-0">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* RIGHT - Chat Window */}
        {currentConversation ? (
          <Card
            className={`lg:col-span-2 border-0 shadow-medium h-full flex flex-col overflow-hidden ${
              !showChat ? "hidden lg:flex" : "flex"
            }`}
          >
            <CardHeader className="border-b flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleBack} className="lg:hidden">
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                {loadingImages[currentConversation.profileId] ? (
                  <div className="w-10 h-10 border-2 border-primary rounded-full animate-pulse bg-muted" />
                ) : (
                  <Avatar
                    className="w-10 h-10 border-2 border-primary cursor-pointer"
                    onClick={() => {
                      const profileImage = profileImages[currentConversation.profileId];
                      if (profileImage) {
                        openFullImage(profileImage);
                      }
                    }}
                  >
                    {profileImages[currentConversation.profileId] ? (
                      <AvatarImage src={profileImages[currentConversation.profileId]} />
                    ) : (
                      <AvatarFallback>{getInitials(currentConversation.name)}</AvatarFallback>
                    )}
                  </Avatar>
                )}

                <div>
                  <CardTitle className="text-lg">{currentConversation.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {typingUsers[selectedConversation]
                      ? `${typingUsers[selectedConversation]} is typing...`
                      : currentConversation.status}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {(!messages[selectedConversation] || messages[selectedConversation]?.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                {messages[selectedConversation]?.map((message, idx) => {
                  if (message.deletedForMe) return null;

                  const deletedForEveryone = message.deletedForEveryone;
                  // Create a unique key combining multiple properties
                  const uniqueKey = message.id 
                    ? `msg-${message.id}` 
                    : `temp-${selectedConversation}-${idx}-${message.time}-${message.text?.substring(0, 10)}`;

                  return (
                    <div
                      key={uniqueKey}
                      className={`flex gap-2 items-center group relative ${
                        message.isSent ? "justify-end" : ""
                      }`}
                    >
                      {/* Three dots button for sent messages (left side) */}
                      {message.isSent && (
                        <button
                          className="transition p-1 hover:bg-gray-100 rounded flex-shrink-0"
                          onClick={(e) => openContextMenu(e, idx, message)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 hover:text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="6" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="18" r="1.5" />
                          </svg>
                        </button>
                      )}

                      <div
                        className={`rounded-lg p-3 max-w-[70%] ${
                          message.isSent
                            ? "bg-gradient-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">
                          {deletedForEveryone
                            ? message.isSent
                              ? "You deleted this message"
                              : "This message was deleted"
                            : message.text}
                        </p>

                        <p className="text-xs opacity-70 mt-1">{message.time}</p>
                      </div>

                      {/* Three dots button for received messages (right side) */}
                      {!message.isSent && (
                        <button
                          className="transition p-1 hover:bg-gray-100 rounded flex-shrink-0"
                          onClick={(e) => openContextMenu(e, idx, message)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 hover:text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="6" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="18" r="1.5" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t flex gap-2 flex-shrink-0">
              <Input
                placeholder="Type your message..."
                className="flex-1"
                value={messageInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <Button className="bg-gradient-primary" onClick={sendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="lg:col-span-2 border-0 shadow-medium h-full hidden lg:flex items-center justify-center overflow-hidden">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">💬</p>
              <p>Select a conversation to start messaging</p>
            </div>
          </Card>
        )}
      </div>

      {/* DELETE MENU */}
      {contextMenu.message && (
        <div
          className="fixed bg-white shadow-lg rounded-lg p-2 border w-40 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            onClick={() => deleteForMe(contextMenu.messageIndex)}
          >
            Delete for Me
          </button>

          {contextMenu.message.isSent && (
            <button
              className="w-full text-left px-3 py-2 hover:bg-red-100 text-sm text-red-600"
              onClick={() => deleteForEveryone(contextMenu.messageIndex)}
            >
              Delete for Everyone
            </button>
          )}
        </div>
      )}

      <FullImageViewer
        imageUrl={selectedImageUrl}
        open={imageViewerOpen}
        onOpenChange={setImageViewerOpen}
        shape="circle"
      />

      {/* Use the dedicated SubscriptionModal component */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  );
};

export default Messages;

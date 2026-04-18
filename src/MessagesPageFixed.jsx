import React, { useState, useEffect, useRef } from "react";
import * as api from "./api";

const formatTime = (dateString) => {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "just now";
  
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
                  
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  if (isToday) {
    return date.toLocaleTimeString([], timeOptions);
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], timeOptions);
  }
};

const toNumericId = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const resolveFocusedConversation = (conversations, focus) => {
  if (!focus || !Array.isArray(conversations) || conversations.length === 0) return null;

  const targetConversationId = toNumericId(focus.conversationId);
  const targetListingId = toNumericId(focus.listingId);
  const targetOtherUserId = toNumericId(focus.otherUserId);

  if (targetConversationId !== null) {
    const foundById = conversations.find((conv) => toNumericId(conv.id) === targetConversationId);
    if (foundById) return foundById;
  }

  if (targetListingId !== null) {
    const foundByListing = conversations.find((conv) => {
      if (toNumericId(conv.listingId) !== targetListingId) return false;
      if (targetOtherUserId === null) return true;
      const convOtherUserId = toNumericId(conv.otherUser?.id ?? conv.otherUserId);
      return convOtherUserId === targetOtherUserId;
    });
    if (foundByListing) return foundByListing;
  }

  return null;
};

function Avatar({ src, size = 40, alt = "Avatar", style = {} }) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = typeof src === "string" ? src.trim() : "";
  const hasImage = normalizedSrc !== "" && !hasError;
  const numericSize = typeof size === "number" ? size : parseInt(size, 10) || 40;
  const baseStyle = {
    width: numericSize,
    height: numericSize,
    borderRadius: "50%",
    flexShrink: 0,
    ...style
  };

  if (hasImage) {
    return (
      <img
        src={normalizedSrc}
        alt={alt}
        style={{ ...baseStyle, objectFit: "cover" }}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div style={{
      ...baseStyle,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--light-gray)",
      color: "var(--gray)",
      fontSize: Math.max(12, Math.round(numericSize * 0.42)),
      fontWeight: 700,
      border: style.border || "1px solid var(--border)"
    }}>
      <span style={{ lineHeight: 1 }}></span>
    </div>
  );
}


export function MessagesPage({ language, setPage, user, TRANSLATIONS, conversationFocus, clearConversationFocus }) {
  const t = TRANSLATIONS[language];
  const [activeChat, setActiveChat] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) {
        setUserMessages([]);
        setActiveChat(null);
        setMessages({});
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const conversations = await api.fetchConversations();
        const normalizedConversations = Array.isArray(conversations) ? conversations : [];
        if (normalizedConversations.length > 0) {
          setUserMessages(normalizedConversations);
          setActiveChat((prev) => {
            const focused = resolveFocusedConversation(normalizedConversations, conversationFocus);
            if (focused) {
              const focusListingName = conversationFocus?.listingName;
              return {
                ...focused,
                listingName: focused.listingName || focusListingName || focused.listingTitle || null
              };
            }

            if (prev?.id) {
              const previousStillExists = normalizedConversations.find((conv) => toNumericId(conv.id) === toNumericId(prev.id));
              if (previousStillExists) return previousStillExists;
            }

            return normalizedConversations[0];
          });
        } else {
          setUserMessages([]);
          setActiveChat(null);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setUserMessages([]);
        setActiveChat(null);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, [user?.id]);

  useEffect(() => {
    if (!conversationFocus || userMessages.length === 0) return;

    const focused = resolveFocusedConversation(userMessages, conversationFocus);
    if (focused) {
      const focusListingName = conversationFocus?.listingName;
      setActiveChat({
        ...focused,
        listingName: focused.listingName || focusListingName || focused.listingTitle || null
      });
    }

    clearConversationFocus?.();
  }, [conversationFocus, userMessages, clearConversationFocus]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeChat?.id) return;
      try {
        const conversationMessages = await api.fetchMessages(activeChat.id);
        // Normalize messages: backend returns { sender: User }, we need { senderId: id }
        const normalized = Array.isArray(conversationMessages) ? conversationMessages.map(msg => ({
          ...msg,
          senderId: msg.senderId || msg.sender?.id,
          content: msg.content || msg.text,
          time: formatTime(msg.createdAt || msg.timestamp || msg.created_at)
        })) : [];
        setMessages(m => ({ ...m, [activeChat.id]: normalized }));
      } catch (err) {
        console.error("Failed to load messages:", err);
        setMessages(m => ({ ...m, [activeChat.id]: [] }));
      }
    };
    loadMessages();
  }, [activeChat?.id, user?.id]);

  const sendMsg = async () => {
    if (!msgInput.trim() || !activeChat?.id) return;
    setSending(true);
    try {
      const newMsg = await api.sendMessage(activeChat.id, msgInput);
      if (newMsg?.id) {
        const msgObj = { content: msgInput, time: formatTime(newMsg.createdAt || newMsg.timestamp || newMsg.created_at || new Date().toISOString()), id: newMsg.id, senderId: String(user?.id) };
        setMessages(m => ({ ...m, [activeChat.id]: [...(m[activeChat.id] || []), msgObj] }));
        setMsgInput("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const reportConversation = async () => {
    if (!activeChat?.id) return;

    setReportSubmitting(true);
    try {
      await api.createReport({
        type: "CONVERSATION",
        targetId: activeChat.id,
        reason: reportReason.trim()
      });
      alert("Conversation report submitted.");
      setShowReportModal(false);
      setReportReason("");
    } catch (err) {
      console.error("Conversation report error:", err);
      alert(err.message || "Request failed");
    } finally {
      setReportSubmitting(false);
    }
  };

  const deleteMsg = async (messageId) => {
    if (!activeChat?.id || !messageId) return;

    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    setDeletingMessageId(messageId);
    try {
      await api.deleteMessage(messageId);
      setMessages((m) => ({
        ...m,
        [activeChat.id]: (m[activeChat.id] || []).filter((msg) => String(msg.id) !== String(messageId))
      }));
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert(err.message || "Failed to delete message");
    } finally {
      setDeletingMessageId(null);
    }
  };

  const activeMessages = activeChat?.id ? (messages[activeChat.id] || []) : [];

  useEffect(() => {
    if (!activeChat?.id) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeChat?.id, activeMessages.length]);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 24px", animation: "fadeIn 0.4s ease" }}>
      <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>← Back</button>
      <h1 className="page-header">Messages</h1>
      {!user ? (
        <div style={{ background: "white", borderRadius: "var(--radius)", padding: 40, textAlign: "center", boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}></div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sign in to view messages</div>
          <div style={{ color: "var(--gray)", marginBottom: 24 }}>You need to be logged in to access your conversations</div>
        </div>
      ) : loading ? (
        <div style={{ background: "white", borderRadius: "var(--radius)", padding: 40, textAlign: "center", boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 18 }}>Loading conversations...</div>
        </div>
      ) : userMessages.length === 0 ? (
        <div style={{ background: "white", borderRadius: "var(--radius)", padding: 40, textAlign: "center", boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}></div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No conversations yet</div>
          <div style={{ color: "var(--gray)" }}>Start a conversation by messaging a seller</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 0, background: "white", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)", overflow: "hidden", height: 620 }}>
          <div style={{ borderRight: "1px solid var(--border)", overflow: "hidden", display: "flex", flexDirection: "column", background: "#f8fbfd" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "white" }}>
              <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray)", fontWeight: 700, marginBottom: 4 }}>Inbox</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--dark)" }}>{userMessages.length} conversation{userMessages.length > 1 ? "s" : ""}</div>
            </div>
            <div style={{ overflowY: "auto", padding: 8 }}>
              {userMessages.map(conv => {
                const fallbackId = conv.otherUserId ?? conv.user2Id ?? conv.user1Id ?? "?";
                const otherUserName = conv.otherUser?.fullName || conv.otherUser?.name || `User #${fallbackId}`;
                const listingLabel = conv.listingName || conv.listingTitle || (conv.listingId ? `#${conv.listingId}` : "N/A");
                const isActive = toNumericId(activeChat?.id) === toNumericId(conv.id);

                return (
                  <div
                    key={conv.id}
                    onClick={() => { setActiveChat(conv); }}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: 12,
                      marginBottom: 8,
                      cursor: "pointer",
                      borderRadius: 14,
                      border: isActive ? "1px solid rgba(27,154,140,0.35)" : "1px solid transparent",
                      background: isActive ? "linear-gradient(135deg, #eaf9f6 0%, #f4fbff 100%)" : "white",
                      boxShadow: isActive ? "0 10px 26px rgba(15, 111, 117, 0.10)" : "none",
                      transition: "all 0.2s"
                    }}
                  >
                    <Avatar src={conv.otherUser?.imageUrl} size={44} alt={`${otherUserName} avatar`} />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color: "var(--dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{otherUserName}</div>
                      <div style={{ fontSize: 12, color: "var(--teal-dark)", fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{`Listing: ${listingLabel}`}</div>
                      <div style={{ fontSize: 12, color: "var(--gray)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Tap to open chat</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
            {activeChat ? (
              <>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(180deg, #ffffff 0%, #f6fbfa 100%)", flexShrink: 0 }}>
                  <Avatar src={activeChat.otherUser?.imageUrl} size={40} alt="Chat user avatar" />
                  <div>
                    <div style={{ fontWeight: 800 }}>{activeChat.otherUser?.fullName || activeChat.otherUser?.name || "User"}</div>
                    <div style={{ fontSize: 12, color: "var(--teal-dark)", fontWeight: 600 }}>{`Listing: ${activeChat.listingName || activeChat.listingTitle || (activeChat.listingId ? `#${activeChat.listingId}` : "N/A")}`}</div>
                  </div>
                  <button
                    onClick={() => setShowReportModal(true)}
                    disabled={reportSubmitting}
                    style={{
                      marginLeft: "auto",
                      background: "white",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: reportSubmitting ? "not-allowed" : "pointer",
                      opacity: reportSubmitting ? 0.7 : 1
                    }}
                  >
                     Report Conversation
                  </button>
                </div>
                <div style={{ 
                  flex: 1, 
                  overflowY: "auto", 
                  padding: 20, 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 16,
                  background: "linear-gradient(180deg, #f9fcff 0%, #ffffff 100%)"
                }} className="messages-container">
                  {activeMessages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--gray)", padding: "40px 20px" }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}></div>
                      <div>Start a conversation!</div>
                    </div>
                  ) : (
                    activeMessages.map((msg, i) => {
                      const isFromMe = String(msg.senderId) === String(user?.id);
                      const senderName = isFromMe ? "You" : (activeChat.otherUser?.fullName || "User");
                      const isDeleting = String(deletingMessageId) === String(msg.id);
                      return (
                        <div key={msg.id ?? i} style={{ display: "flex", flexDirection: "column", alignItems: isFromMe ? "flex-end" : "flex-start", gap: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ fontSize: 11, color: "var(--gray)", fontWeight: 500 }}>{senderName}</div>
                            {isFromMe && msg.id && (
                              <button
                                onClick={() => deleteMsg(msg.id)}
                                disabled={isDeleting}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#dc2626",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: isDeleting ? "not-allowed" : "pointer",
                                  opacity: isDeleting ? 0.6 : 1,
                                  padding: 0
                                }}
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            )}
                          </div>
                          <div style={{
                            maxWidth: "78%",
                            padding: "11px 16px",
                            borderRadius: isFromMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                            background: isFromMe ? "linear-gradient(135deg, #158a7e 0%, #0f6f75 100%)" : "#ffffff",
                            border: isFromMe ? "none" : "1px solid #dce6f0",
                            boxShadow: "0 6px 18px rgba(8, 24, 48, 0.08)",
                            color: isFromMe ? "white" : "var(--dark)",
                            fontSize: 14
                          }}>
                            <div>{msg.content || msg.text}</div>
                            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, textAlign: "right" }}>{msg.time || "just now"}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, flexShrink: 0, background: "white" }}>
                  <input className="input-field" style={{ flex: 1, borderRadius: 999, borderWidth: 2 }} placeholder="Type a message..." value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} disabled={sending} />
                  <button className="btn-primary" style={{ padding: "10px 22px", borderRadius: 999, opacity: sending ? 0.6 : 1 }} onClick={sendMsg} disabled={sending}>{sending ? "Sending..." : "Send"}</button>
                </div>

                {showReportModal && (
                  <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10000,
                    padding: 20
                  }}>
                    <div style={{
                      background: "white",
                      borderRadius: 16,
                      padding: 24,
                      maxWidth: 480,
                      width: "100%",
                      boxShadow: "0 12px 48px rgba(0,0,0,0.15)"
                    }}>
                      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}> Report Conversation</h2>
                      <p style={{ color: "var(--gray)", marginBottom: 14, fontSize: 14 }}>
                        Explain why this conversation should be reviewed.
                      </p>

                      <textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="Describe the issue..."
                        style={{
                          width: "100%",
                          minHeight: 110,
                          border: "2px solid var(--border)",
                          borderRadius: 8,
                          padding: 12,
                          resize: "vertical",
                          fontFamily: "inherit",
                          fontSize: 14,
                          marginBottom: 14
                        }}
                      />

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => {
                            setShowReportModal(false);
                            setReportReason("");
                          }}
                          style={{
                            flex: 1,
                            padding: 11,
                            border: "1px solid var(--border)",
                            borderRadius: 999,
                            background: "white",
                            color: "var(--gray)",
                            fontWeight: 600
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={reportConversation}
                          disabled={reportSubmitting}
                          style={{
                            flex: 1,
                            padding: 11,
                            border: "none",
                            borderRadius: 999,
                            background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                            color: "white",
                            fontWeight: 700,
                            opacity: reportSubmitting ? 0.7 : 1,
                            cursor: reportSubmitting ? "not-allowed" : "pointer"
                          }}
                        >
                          {reportSubmitting ? "Reporting..." : "Submit Report"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--gray)" }}>Select a conversation</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendMessage, getConversation, getAllConversations } from "../services/messageService";
import toast from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatWindow({ basePath }) {
  const { userId } = useParams();
  const { user, socket } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePartner, setActivePartner] = useState(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllConversations().then(d => setConversations(Object.values(d.conversations || {}))).catch(() => {});
  }, []);

  useEffect(() => {
    if (userId) {
      getConversation(userId).then(d => setMessages(d.messages || [])).catch(() => {});
    }
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (msg) => {
        if (msg.sender._id === userId || msg.receiver._id === userId) {
          setMessages(prev => [...prev, msg]);
        }
      });
      return () => socket.off("receiveMessage");
    }
  }, [socket, userId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    setLoading(true);
    try {
      const data = await sendMessage({ receiverId: userId, content: text });
      setMessages(prev => [...prev, data.message]);
      setText("");
      if (socket) socket.emit("sendMessage", { receiverId: userId, message: data.message });
    } catch { toast.error("Failed to send message"); }
    finally { setLoading(false); }
  };

  return (
    <div className="chat-container sb-card overflow-hidden">
      {/* Conversation List */}
      <div className="chat-list">
        <div className="p-3 border-bottom"><h6 className="fw-bold mb-0">Messages</h6></div>
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted small">No conversations yet</div>
        ) : conversations.map((c, i) => (
          <div key={i} className={`d-flex align-items-center gap-3 p-3 border-bottom cursor-pointer ${c.partner._id === userId ? "bg-light" : ""}`}
            style={{cursor:"pointer"}} onClick={() => navigate(`${basePath}/${c.partner._id}`)}>
            <div style={{width:40,height:40,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:600,flexShrink:0}}>
              {c.partner.name?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="fw-semibold small">{c.partner.name}</div>
              <div className="text-muted" style={{fontSize:"0.75rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {c.lastMessage?.content}
              </div>
            </div>
            {c.unread > 0 && <span className="badge bg-primary rounded-pill">{c.unread}</span>}
          </div>
        ))}
      </div>
      {/* Chat Window */}
      <div className="chat-window">
        {!userId ? (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <div className="text-center"><div style={{fontSize:"3rem"}}>💬</div><p>Select a conversation</p></div>
          </div>
        ) : (
          <>
            <div className="p-3 border-bottom bg-white d-flex align-items-center gap-3">
              <div style={{width:36,height:36,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:600}}>
                {messages[0]?.sender._id === user?._id ? messages[0]?.receiver?.name?.charAt(0) : messages[0]?.sender?.name?.charAt(0)}
              </div>
              <div className="fw-semibold">{messages[0]?.sender._id === user?._id ? messages[0]?.receiver?.name : messages[0]?.sender?.name || "Chat"}</div>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => {
                const isMine = m.sender._id === user?._id || m.sender?._id === user?._id;
                return (
                  <div key={i} className={`d-flex ${isMine ? "justify-content-end" : "justify-content-start"} mb-2`}>
                    <div className={`msg-bubble ${isMine ? "msg-sent" : "msg-received"}`}>
                      <div>{m.content}</div>
                      <small style={{opacity:0.7,fontSize:"0.65rem"}}>{new Date(m.createdAt).toLocaleTimeString()}</small>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}/>
            </div>
            <form onSubmit={handleSend} className="chat-input-area d-flex gap-2">
              <input className="form-control" placeholder="Type a message..." value={text} onChange={e => setText(e.target.value)} />
              <button type="submit" className="btn btn-primary px-3" disabled={loading || !text.trim()}>
                {loading ? <span className="spinner-border spinner-border-sm"/> : <FaPaperPlane/>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUser } from "../services/authService";
import { io } from "socket.io-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getUser();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    if (user?._id) {
      const s = io("http://localhost:5000", { withCredentials: true });
      s.emit("join", user._id);
      s.on("receiveNotification", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((c) => c + 1);
      });
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user?._id]);

  const logout = () => {
    setUser(null);
    if (socket) socket.disconnect();
    setSocket(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout, socket, notifications, unreadCount, setUnreadCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

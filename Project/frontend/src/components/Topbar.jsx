import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutApi } from "../services/authService";
import { getNotifications, markAllNotifAsRead } from "../services/notificationService";
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function Topbar({ title }) {
  const { user, logout, unreadCount, setUnreadCount } = useAuth();
  const navigate = useNavigate();
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (user) {
      getNotifications().then((d) => { setNotifs(d.notifications || []); setUnreadCount(d.unreadCount || 0); }).catch(() => {});
    }
  }, [user]);

  const handleLogout = async () => {
    try { await logoutApi(); } catch {}
    logout();
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const handleOpenNotif = (e) => {
    setNotifAnchor(e.currentTarget);
    if (unreadCount > 0) { markAllNotifAsRead().then(() => setUnreadCount(0)).catch(() => {}); }
  };

  const role = user?.role?.toLowerCase();

  return (
    <div className="sb-topbar">
      <h6 className="mb-0 fw-semibold text-dark">{title}</h6>
      <div className="d-flex align-items-center gap-3">
        {/* Notifications */}
        <IconButton onClick={handleOpenNotif} size="small">
          <Badge badgeContent={unreadCount} color="error">
            <FaBell style={{ color: "#64748b", fontSize: "1.1rem" }} />
          </Badge>
        </IconButton>
        <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}
          PaperProps={{ sx: { width: 320, maxHeight: 400, overflow: "auto" } }}>
          <MenuItem disabled><Typography variant="subtitle2" fontWeight={600}>Notifications</Typography></MenuItem>
          <Divider />
          {notifs.length === 0 ? (
            <MenuItem><Typography variant="body2" color="text.secondary">No notifications</Typography></MenuItem>
          ) : notifs.slice(0, 10).map((n, i) => (
            <MenuItem key={i} sx={{ whiteSpace: "normal", py: 1.5 }}>
              <div>
                <Typography variant="body2" fontWeight={600}>{n.title}</Typography>
                <Typography variant="caption" color="text.secondary">{n.message}</Typography>
              </div>
            </MenuItem>
          ))}
        </Menu>
        {/* User Menu */}
        <IconButton onClick={(e) => setUserAnchor(e.currentTarget)} size="small">
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.8rem", fontWeight: 600 }}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </IconButton>
        <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)}>
          <MenuItem disabled>
            <div>
              <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "#dc2626" }}>
            <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

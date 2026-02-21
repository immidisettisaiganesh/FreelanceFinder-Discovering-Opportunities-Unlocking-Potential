import { Outlet, NavLink } from "react-router-dom";
import { MdDashboard, MdWork, MdChat } from "react-icons/md";
import Topbar from "../components/Topbar";

export default function OwnerLayout() {
  return (
    <div>
      <div className="sb-sidebar">
        <div className="brand"><h4>SB<span>Works</span></h4><small style={{color:"#94a3b8",fontSize:"0.75rem"}}>Client Portal</small></div>
        <nav className="mt-3 flex-1">
          <NavLink to="/owner/dashboard" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdDashboard/><span>Dashboard</span></NavLink>
          <NavLink to="/owner/projects" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdWork/><span>My Projects</span></NavLink>
          <NavLink to="/owner/chat" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdChat/><span>Messages</span></NavLink>
        </nav>
      </div>
      <div className="sb-main">
        <Topbar title="Client Dashboard" />
        <div className="sb-content"><Outlet /></div>
      </div>
    </div>
  );
}

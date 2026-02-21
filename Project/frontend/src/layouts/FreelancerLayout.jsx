import { Outlet, NavLink } from "react-router-dom";
import { MdDashboard, MdSearch, MdDescription, MdWork, MdChat } from "react-icons/md";
import Topbar from "../components/Topbar";

export default function FreelancerLayout() {
  return (
    <div>
      <div className="sb-sidebar">
        <div className="brand"><h4>SB<span>Works</span></h4><small style={{color:"#94a3b8",fontSize:"0.75rem"}}>Freelancer Portal</small></div>
        <nav className="mt-3">
          <NavLink to="/freelancer/dashboard" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdDashboard/><span>Dashboard</span></NavLink>
          <NavLink to="/freelancer/browse" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdSearch/><span>Browse Projects</span></NavLink>
          <NavLink to="/freelancer/proposals" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdDescription/><span>My Proposals</span></NavLink>
          <NavLink to="/freelancer/my-projects" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdWork/><span>My Projects</span></NavLink>
          <NavLink to="/freelancer/chat" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdChat/><span>Messages</span></NavLink>
        </nav>
      </div>
      <div className="sb-main">
        <Topbar title="Freelancer Dashboard" />
        <div className="sb-content"><Outlet /></div>
      </div>
    </div>
  );
}

import { Outlet, NavLink } from "react-router-dom";
import { MdDashboard, MdPeople, MdWork, MdDescription } from "react-icons/md";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div>
      <div className="sb-sidebar">
        <div className="brand"><h4>SB<span>Works</span></h4><small style={{color:"#94a3b8",fontSize:"0.75rem"}}>Admin Panel</small></div>
        <nav className="mt-3">
          <NavLink to="/admin/dashboard" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdDashboard/><span>Dashboard</span></NavLink>
          <NavLink to="/admin/users" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdPeople/><span>Users</span></NavLink>
          <NavLink to="/admin/projects" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdWork/><span>Projects</span></NavLink>
          <NavLink to="/admin/proposals" className={({isActive})=>`nav-link${isActive?" active":""}`}><MdDescription/><span>Proposals</span></NavLink>
        </nav>
      </div>
      <div className="sb-main">
        <Topbar title="Admin Panel" />
        <div className="sb-content"><Outlet /></div>
      </div>
    </div>
  );
}

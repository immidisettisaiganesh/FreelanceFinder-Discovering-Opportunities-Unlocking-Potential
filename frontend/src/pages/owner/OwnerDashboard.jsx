import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOwnerProjects } from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";
import { MdWork, MdPeople, MdCheckCircle, MdTrendingUp } from "react-icons/md";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnerProjects().then(d => setProjects(d.projects || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const open = projects.filter(p => p.status === "OPEN").length;
  const closed = projects.filter(p => p.status === "CLOSED").length;
  const totalBids = projects.reduce((s, p) => s + (p.proposals?.length || 0), 0);

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Welcome back, {user?.name?.split(" ")[0]}! 👋</h4>
        <p className="text-muted">Here's an overview of your projects on SB Works.</p>
      </div>
      <div className="row g-4 mb-4">
        {[
          { label: "Total Projects", val: projects.length, icon: <MdWork size={24}/>, color: "#2563eb" },
          { label: "Open Projects", val: open, icon: <MdTrendingUp size={24}/>, color: "#16a34a" },
          { label: "Completed", val: closed, icon: <MdCheckCircle size={24}/>, color: "#7c3aed" },
          { label: "Total Bids", val: totalBids, icon: <MdPeople size={24}/>, color: "#d97706" },
        ].map((s, i) => (
          <div className="col-md-3 col-6" key={i}>
            <div className="sb-card p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted small mb-1">{s.label}</p>
                  <h3 className="fw-bold mb-0">{s.val}</h3>
                </div>
                <div className="rounded-3 p-2" style={{background:`${s.color}15`,color:s.color}}>{s.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="sb-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent Projects</h6>
              <Link to="/owner/projects" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            {loading ? <div className="text-center py-4"><div className="spinner-border text-primary"/></div> :
              projects.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No projects yet. <Link to="/owner/projects">Post your first project!</Link></p>
                </div>
              ) : projects.slice(0, 5).map(p => (
                <div key={p._id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div>
                    <div className="fw-semibold">{p.title}</div>
                    <small className="text-muted">{p.proposals?.length || 0} proposals · Budget: ${p.budget}</small>
                  </div>
                  <span className={`badge badge-${p.status === "OPEN" ? "open" : "closed"} px-3 py-2`}>{p.status}</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className="col-lg-4">
          <div className="sb-card p-4">
            <h6 className="fw-bold mb-3">Quick Actions</h6>
            <div className="d-grid gap-2">
              <Link to="/owner/projects" className="btn btn-primary">+ Post New Project</Link>
              <Link to="/owner/chat" className="btn btn-outline-secondary">💬 Messages</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

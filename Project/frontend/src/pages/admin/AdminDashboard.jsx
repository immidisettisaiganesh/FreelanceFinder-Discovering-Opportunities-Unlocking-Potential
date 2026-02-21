import { useState, useEffect } from "react";
import { getUsersApi } from "../../services/authService";
import { getProjects } from "../../services/projectService";
import { getProposals } from "../../services/proposalService";
import { MdPeople, MdWork, MdDescription, MdVerified } from "react-icons/md";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, projects: 0, proposals: 0, pending: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsersApi(), getProjects(), getProposals()])
      .then(([ud, pd, propd]) => {
        const users = ud.users || [];
        setRecentUsers(users.slice(0, 5));
        setStats({
          users: users.length,
          projects: (pd.projects || []).length,
          proposals: (propd.proposals || []).length,
          pending: users.filter(u => u.status === 1).length,
        });
      }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="mb-4"><h4 className="fw-bold mb-1">Admin Dashboard</h4><p className="text-muted">Platform overview and management</p></div>
      <div className="row g-4 mb-4">
        {[
          { label: "Total Users", val: stats.users, icon: <MdPeople size={24}/>, color: "#2563eb" },
          { label: "Total Projects", val: stats.projects, icon: <MdWork size={24}/>, color: "#16a34a" },
          { label: "Total Proposals", val: stats.proposals, icon: <MdDescription size={24}/>, color: "#7c3aed" },
          { label: "Pending Approvals", val: stats.pending, icon: <MdVerified size={24}/>, color: "#d97706" },
        ].map((s, i) => (
          <div className="col-md-3 col-6" key={i}>
            <div className="sb-card p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div><p className="text-muted small mb-1">{s.label}</p><h3 className="fw-bold mb-0">{s.val}</h3></div>
                <div className="rounded-3 p-2" style={{background:`${s.color}15`,color:s.color}}>{s.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="sb-card p-4">
        <h6 className="fw-bold mb-3">Recent Users</h6>
        {loading ? <div className="text-center py-3"><div className="spinner-border text-primary"/></div> :
          <table className="table mb-0">
            <thead className="table-light"><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u._id}>
                  <td className="fw-semibold">{u.name || "—"}</td>
                  <td>{u.email || "—"}</td>
                  <td><span className="badge bg-secondary">{u.role}</span></td>
                  <td><span className={`badge ${u.status===2?"badge-approved":u.status===0?"badge-rejected":"badge-pending"}`}>
                    {u.status===2?"Approved":u.status===0?"Rejected":"Pending"}
                  </span></td>
                  <td><small className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}

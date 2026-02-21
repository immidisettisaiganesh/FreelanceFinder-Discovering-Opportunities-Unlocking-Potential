import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProposals } from "../../services/proposalService";
import { getMySubmissions } from "../../services/submissionService";
import { useAuth } from "../../context/AuthContext";
import { MdDescription, MdCheckCircle, MdPendingActions, MdStar } from "react-icons/md";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProposals(), getMySubmissions()])
      .then(([pd, sd]) => { setProposals(pd.proposals || []); setSubmissions(sd.submissions || []); })
      .finally(() => setLoading(false));
  }, []);

  const pending = proposals.filter(p => p.status === 1).length;
  const accepted = proposals.filter(p => p.status === 2).length;
  const completed = submissions.filter(s => s.status === "approved").length;

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Welcome, {user?.name?.split(" ")[0]}! 👋</h4>
        <p className="text-muted">Track your proposals, projects and earnings on SB Works.</p>
      </div>
      <div className="row g-4 mb-4">
        {[
          { label: "Total Proposals", val: proposals.length, icon: <MdDescription size={24}/>, color: "#2563eb" },
          { label: "Pending", val: pending, icon: <MdPendingActions size={24}/>, color: "#d97706" },
          { label: "Accepted", val: accepted, icon: <MdCheckCircle size={24}/>, color: "#16a34a" },
          { label: "Completed", val: completed, icon: <MdStar size={24}/>, color: "#7c3aed" },
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
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="sb-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent Proposals</h6>
              <Link to="/freelancer/proposals" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            {loading ? <div className="text-center py-3"><div className="spinner-border text-primary"/></div> :
              proposals.slice(0, 5).map(p => (
                <div key={p._id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                  <div>
                    <div className="fw-semibold">${p.price} · {p.duration} days</div>
                    <small className="text-muted">{p.description?.substring(0, 60)}...</small>
                  </div>
                  <span className={`badge ${p.status===2?"badge-approved":p.status===0?"badge-rejected":"badge-pending"} px-3 py-2`}>
                    {p.status===2?"Accepted":p.status===0?"Rejected":"Pending"}
                  </span>
                </div>
              ))
            }
            {proposals.length === 0 && !loading && <p className="text-muted text-center py-3">No proposals yet. <Link to="/freelancer/browse">Browse projects!</Link></p>}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="sb-card p-4">
            <h6 className="fw-bold mb-3">Your Profile</h6>
            <div className="text-center mb-3">
              <div style={{width:60,height:60,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:"1.5rem",margin:"0 auto 8px"}}>
                {user?.name?.charAt(0)}
              </div>
              <div className="fw-semibold">{user?.name}</div>
              <div className="text-warning small">{"★".repeat(Math.round(user?.rating || 0))} {user?.rating > 0 ? `(${user?.rating})` : "No rating yet"}</div>
            </div>
            <div className="d-grid gap-2">
              <Link to="/freelancer/browse" className="btn btn-primary">🔍 Browse Projects</Link>
              <Link to="/freelancer/chat" className="btn btn-outline-secondary">💬 Messages</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

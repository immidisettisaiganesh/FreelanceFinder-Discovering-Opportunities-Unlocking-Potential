import { useState, useEffect } from "react";
import { getProjects } from "../../services/projectService";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getProjects().then(d => setProjects(d.projects || [])).finally(() => setLoading(false)); }, []);

  return (
    <div className="fade-in">
      <h4 className="fw-bold mb-4">All Projects</h4>
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
        <div className="sb-card overflow-hidden">
          <table className="table mb-0">
            <thead className="table-light"><tr><th>Title</th><th>Category</th><th>Budget</th><th>Status</th><th>Proposals</th><th>Deadline</th></tr></thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id}>
                  <td><div className="fw-semibold">{p.title}</div></td>
                  <td><span className="badge bg-light text-dark">{p.category?.title}</span></td>
                  <td><strong className="text-primary">${p.budget}</strong></td>
                  <td><span className={`badge badge-${p.status==="OPEN"?"open":"closed"} px-3 py-2`}>{p.status}</span></td>
                  <td>{p.proposals?.length || 0}</td>
                  <td><small className="text-muted">{new Date(p.deadline).toLocaleDateString()}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

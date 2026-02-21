import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOwnerProjects, deleteProject, toggleProjectStatus } from "../../services/projectService";
import { getCategoryList } from "../../services/categoryService";
import CreateProjectModal from "../../components/owner/CreateProjectModal";
import toast from "react-hot-toast";

export default function OwnerProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const load = () => {
    setLoading(true);
    getOwnerProjects().then(d => setProjects(d.projects || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try { await deleteProject(id); toast.success("Project deleted"); load(); }
    catch (e) { toast.error(e?.response?.data?.message || "Cannot delete assigned project"); }
  };

  const handleToggle = async (id, current) => {
    try {
      await toggleProjectStatus({ id, data: { status: current === "OPEN" ? "CLOSED" : "OPEN" } });
      toast.success("Status updated"); load();
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1">My Projects</h4><p className="text-muted mb-0">Manage all your posted projects</p></div>
        <button className="btn btn-primary fw-semibold" onClick={() => { setEditProject(null); setShowModal(true); }}>+ Post Project</button>
      </div>
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
        projects.length === 0 ? (
          <div className="sb-card p-5 text-center">
            <h5 className="text-muted">No projects yet</h5>
            <p className="text-muted">Post your first project to start receiving proposals from talented freelancers.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Post Your First Project</button>
          </div>
        ) : (
          <div className="row g-4">
            {projects.map(p => (
              <div className="col-12" key={p._id}>
                <div className="sb-card p-4">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className={`badge badge-${p.status==="OPEN"?"open":"closed"} px-3 py-2`}>{p.status}</span>
                        <span className="badge bg-light text-dark">{p.category?.title}</span>
                      </div>
                      <h6 className="fw-bold mb-1">{p.title}</h6>
                      <p className="text-muted small mb-0">{p.description?.substring(0, 100)}...</p>
                    </div>
                    <div className="col-md-3 text-md-center">
                      <div className="fw-semibold text-primary">${p.budget}</div>
                      <small className="text-muted">Budget</small>
                      <div className="fw-semibold mt-1">{p.proposals?.length || 0}</div>
                      <small className="text-muted">Proposals</small>
                    </div>
                    <div className="col-md-3 d-flex gap-2 justify-content-md-end mt-3 mt-md-0 flex-wrap">
                      <Link to={`/owner/projects/${p._id}`} className="btn btn-sm btn-outline-primary">View Bids</Link>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditProject(p); setShowModal(true); }}>Edit</button>
                      <button className="btn btn-sm btn-outline-warning" onClick={() => handleToggle(p._id, p.status)}>
                        {p.status==="OPEN"?"Close":"Open"}
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      {showModal && <CreateProjectModal show={showModal} onClose={() => setShowModal(false)} onSuccess={load} editData={editProject} />}
    </div>
  );
}

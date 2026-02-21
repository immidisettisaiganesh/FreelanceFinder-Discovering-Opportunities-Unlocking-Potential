import { useState, useEffect } from "react";
import { getProjects } from "../../services/projectService";
import { addProposal } from "../../services/proposalService";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ price: "", duration: "", description: "" });
  const [bidLoading, setBidLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProjects({ status: "OPEN" }).then(d => setProjects(d.projects || [])).finally(() => setLoading(false));
  }, []);

  const handleBid = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    try {
      await addProposal({
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        projectId: selected._id
      });
      toast.success("✅ Proposal submitted!");
      setSelected(null);
      setForm({ price: "", duration: "", description: "" });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error submitting proposal");
    } finally { setBidLoading(false); }
  };

  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Browse Projects</h4>
        <p className="text-muted">Find projects that match your skills and expertise</p>
      </div>
      <div className="mb-4">
        <input className="form-control form-control-lg"
          placeholder="🔍 Search by title, description or tags..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="sb-card p-5 text-center">
          <div style={{ fontSize: "3rem" }}>🔍</div>
          <p className="text-muted mt-2">No open projects found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(p => (
            <div className="col-lg-6" key={p._id}>
              <div className="sb-card p-4 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge badge-open px-3 py-2">OPEN</span>
                  <span className="fw-bold text-primary fs-5">${p.budget}</span>
                </div>
                <h6 className="fw-bold mb-2">{p.title}</h6>
                <p className="text-muted small mb-3 flex-grow-1">{p.description?.substring(0, 120)}...</p>
                {p.tags?.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {p.tags.slice(0, 5).map(t => <span key={t} className="badge bg-light text-dark">{t}</span>)}
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                  <div>
                    <small className="text-muted d-block">📅 {new Date(p.deadline).toLocaleDateString()}</small>
                    {p.category?.title && <small className="text-muted">🏷️ {p.category.title}</small>}
                  </div>
                  <button className="btn btn-primary btn-sm fw-semibold px-3" onClick={() => setSelected(p)}>
                    Submit Proposal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <Modal show onHide={() => setSelected(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Submit Proposal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="alert alert-light mb-3 py-2">
              <strong>{selected.title}</strong>
              <br /><small className="text-muted">Client Budget: ${selected.budget}</small>
            </div>
            <form onSubmit={handleBid}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">Your Bid (USD) *</label>
                  <input type="number" className="form-control" placeholder="e.g. 300"
                    value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required min={1} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Delivery (days) *</label>
                  <input type="number" className="form-control" placeholder="e.g. 7"
                    value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required min={1} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Cover Letter *</label>
                  <textarea className="form-control" rows={5}
                    placeholder="Describe your approach, relevant experience, and why you're the best fit for this project..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="col-12 d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-light" onClick={() => setSelected(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold" disabled={bidLoading}>
                    {bidLoading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Submit Proposal
                  </button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

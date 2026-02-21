import { useState, useEffect } from "react";
import { getMySubmissions, submitWork } from "../../services/submissionService";
import { getProposals } from "../../services/proposalService";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

export default function FreelancerProjects() {
  const [submissions, setSubmissions] = useState([]);
  const [acceptedProposals, setAcceptedProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [form, setForm] = useState({ description: "", file: null });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getMySubmissions(), getProposals()])
      .then(([sd, pd]) => {
        setSubmissions(sd.submissions || []);
        setAcceptedProposals((pd.proposals || []).filter(p => p.status === 2));
      }).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return toast.error("No project selected");
    setSubmitting(true);
    const fd = new FormData();
    fd.append("projectId", selectedProjectId);
    fd.append("description", form.description);
    if (form.file) fd.append("file", form.file);
    try {
      await submitWork(fd);
      toast.success("✅ Work submitted!");
      setSubmitModal(false);
      setForm({ description: "", file: null });
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error submitting work");
    } finally { setSubmitting(false); }
  };

  const openSubmitModal = (projectId) => {
    setSelectedProjectId(projectId);
    setSubmitModal(true);
  };

  const statusColor = { submitted: "badge-pending", approved: "badge-approved", revision_requested: "badge-rejected" };
  const statusLabel = { submitted: "Under Review", approved: "✓ Approved", revision_requested: "Revision Needed" };

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">My Projects</h4>
        <p className="text-muted">Manage your active work and submissions</p>
      </div>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          <h6 className="text-muted fw-semibold mb-3">Active Projects (Accepted Proposals)</h6>
          {acceptedProposals.length === 0 ? (
            <div className="alert alert-light text-center py-4">No active projects yet. Keep bidding!</div>
          ) : acceptedProposals.map(p => {
            const projectId = p.project?._id || p.project;
            const sub = submissions.find(s => {
              const sid = s.project?._id || s.project;
              return sid?.toString() === projectId?.toString();
            });
            return (
              <div key={p._id} className="sb-card p-4 mb-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h6 className="fw-bold mb-1">{p.project?.title || "Project"}</h6>
                    <small className="text-muted">
                      Bid: <strong className="text-primary">${p.price}</strong> · {p.duration} days
                    </small>
                  </div>
                  {!sub ? (
                    <button className="btn btn-success fw-semibold" onClick={() => openSubmitModal(projectId)}>
                      📤 Submit Work
                    </button>
                  ) : (
                    <div className="text-end">
                      <span className={`badge ${statusColor[sub.status]} px-3 py-2`}>{statusLabel[sub.status]}</span>
                      {sub.status === "revision_requested" && (
                        <div className="mt-2">
                          <button className="btn btn-sm btn-warning fw-semibold" onClick={() => openSubmitModal(projectId)}>
                            ↺ Resubmit Work
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {sub?.clientFeedback && (
                  <div className="alert alert-warning mt-3 mb-0 small py-2">
                    <strong>Client Feedback:</strong> {sub.clientFeedback}
                  </div>
                )}
              </div>
            );
          })}
          {submissions.length > 0 && (
            <>
              <h6 className="text-muted fw-semibold mb-3 mt-4">Submission History</h6>
              {submissions.map(s => (
                <div key={s._id} className="sb-card p-4 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">{s.project?.title || "Project"}</h6>
                      <small className="text-muted">{new Date(s.createdAt).toLocaleDateString()}</small>
                    </div>
                    <span className={`badge ${statusColor[s.status]} px-3 py-2`}>{statusLabel[s.status]}</span>
                  </div>
                  {s.description && <p className="text-muted small mt-2 mb-0">{s.description}</p>}
                  {s.clientFeedback && (
                    <div className="alert alert-warning mt-2 mb-0 small py-2">
                      <strong>Feedback:</strong> {s.clientFeedback}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </>
      )}
      <Modal show={submitModal} onHide={() => setSubmitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Submit Your Work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Description *</label>
              <textarea className="form-control" rows={5}
                placeholder="Describe what you've completed and any notes for the client..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Attach File (optional)</label>
              <input type="file" className="form-control" onChange={e => setForm({ ...form, file: e.target.files[0] })} />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => setSubmitModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-success fw-semibold" disabled={submitting}>
                {submitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Submit Work
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

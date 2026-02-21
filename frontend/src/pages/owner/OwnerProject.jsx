import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById } from "../../services/projectService";
import { changeProposalStatus } from "../../services/proposalService";
import { getSubmissionByProject, reviewSubmission } from "../../services/submissionService";
import { addReview } from "../../services/reviewService";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

export default function OwnerProject() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    try {
      const [pd, sd] = await Promise.all([
        getProjectById(id),
        getSubmissionByProject(id).catch(() => ({ submission: null }))
      ]);
      setProject(pd.project);
      setSubmission(sd.submission);
    } catch (err) {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleProposalAction = async (proposalId, status) => {
    if (!window.confirm(`${status === 2 ? "Accept" : "Reject"} this proposal?`)) return;
    setActionLoading(true);
    try {
      await changeProposalStatus({ id: proposalId, data: { status, projectId: id } });
      toast.success(status === 2 ? "Freelancer hired!" : "Proposal rejected");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error updating proposal");
    } finally { setActionLoading(false); }
  };

  const handleSubmissionReview = async (status) => {
    setActionLoading(true);
    try {
      await reviewSubmission({ id: submission._id, data: { status, clientFeedback: feedback } });
      toast.success(status === "approved" ? "✅ Work approved!" : "↺ Revision requested");
      setFeedback("");
      load();
    } catch {
      toast.error("Error reviewing submission");
    } finally { setActionLoading(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await addReview({ projectId: id, revieweeId: project.freelancer?._id, rating, comment });
      toast.success("⭐ Review submitted!");
      setReviewModal(false);
      setReviewDone(true);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!project) return <div className="alert alert-danger m-4">Project not found</div>;

  return (
    <div className="fade-in">
      <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
        <Link to="/owner/projects" className="btn btn-sm btn-outline-secondary">← Back</Link>
        <h4 className="fw-bold mb-0">{project.title}</h4>
        <span className={`badge badge-${project.status === "OPEN" ? "open" : "closed"} px-3 py-2`}>{project.status}</span>
      </div>
      <div className="row g-4">
        <div className="col-lg-8">
          {/* Project Info */}
          <div className="sb-card p-4 mb-4">
            <h6 className="fw-bold mb-3">Project Details</h6>
            <p className="text-muted">{project.description}</p>
            <div className="row g-3 mt-1 border-top pt-3">
              <div className="col-4">
                <small className="text-muted d-block">Budget</small>
                <strong className="text-primary">${project.budget}</strong>
              </div>
              <div className="col-4">
                <small className="text-muted d-block">Deadline</small>
                <strong>{new Date(project.deadline).toLocaleDateString()}</strong>
              </div>
              <div className="col-4">
                <small className="text-muted d-block">Category</small>
                <strong>{project.category?.title || "—"}</strong>
              </div>
            </div>
            {project.tags?.length > 0 && (
              <div className="mt-3 d-flex flex-wrap gap-1">
                {project.tags.map(t => <span key={t} className="badge bg-light text-dark px-3 py-2">{t}</span>)}
              </div>
            )}
          </div>

          {/* Proposals */}
          <div className="sb-card p-4 mb-4">
            <h6 className="fw-bold mb-3">Proposals ({project.proposals?.length || 0})</h6>
            {!project.proposals?.length
              ? <p className="text-muted mb-0">No proposals yet. Share your project to get bids!</p>
              : project.proposals.map(p => (
                <div key={p._id} className="border rounded-3 p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{p.user?.name || "Freelancer"}</strong>
                      <span className={`badge ms-2 ${p.status === 2 ? "badge-approved" : p.status === 0 ? "badge-rejected" : "badge-pending"}`}>
                        {p.status === 2 ? "Accepted" : p.status === 0 ? "Rejected" : "Pending"}
                      </span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">${p.price}</div>
                      <small className="text-muted">{p.duration} days</small>
                    </div>
                  </div>
                  <p className="text-muted small mb-3">{p.description}</p>
                  {p.status === 1 && !project.freelancer && (
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-success fw-semibold" onClick={() => handleProposalAction(p._id, 2)} disabled={actionLoading}>
                        ✓ Accept & Hire
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleProposalAction(p._id, 0)} disabled={actionLoading}>
                        ✗ Reject
                      </button>
                      <Link to={`/owner/chat/${p.user?._id}`} className="btn btn-sm btn-outline-primary">
                        💬 Message
                      </Link>
                    </div>
                  )}
                </div>
              ))
            }
          </div>

          {/* Submitted Work */}
          {submission && (
            <div className="sb-card p-4 mb-4">
              <h6 className="fw-bold mb-3">Submitted Work</h6>
              <div className={`alert ${submission.status === "approved" ? "alert-success" : submission.status === "revision_requested" ? "alert-warning" : "alert-info"} mb-3`}>
                <strong>Status:</strong> {submission.status.replace("_", " ").toUpperCase()}
              </div>
              <p className="text-muted">{submission.description}</p>
              {submission.fileUrl && (
                <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm mb-3">
                  📎 Download Submitted File
                </a>
              )}
              {submission.clientFeedback && (
                <div className="alert alert-secondary small mb-3">
                  <strong>Previous Feedback:</strong> {submission.clientFeedback}
                </div>
              )}
              {submission.status === "submitted" && (
                <div className="border-top pt-3">
                  <label className="form-label fw-semibold">Feedback (optional)</label>
                  <textarea className="form-control mb-3" rows={3} placeholder="Write feedback for freelancer..."
                    value={feedback} onChange={e => setFeedback(e.target.value)} />
                  <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-success fw-semibold" onClick={() => handleSubmissionReview("approved")} disabled={actionLoading}>
                      ✓ Approve Work
                    </button>
                    <button className="btn btn-warning fw-semibold" onClick={() => handleSubmissionReview("revision_requested")} disabled={actionLoading}>
                      ↺ Request Revision
                    </button>
                  </div>
                </div>
              )}
              {submission.status === "approved" && project.freelancer && !reviewDone && (
                <div className="border-top pt-3 mt-3">
                  <p className="text-muted small mb-2">Work approved! Share your experience with a review.</p>
                  <button className="btn btn-primary" onClick={() => setReviewModal(true)}>⭐ Leave a Review</button>
                </div>
              )}
              {reviewDone && <div className="alert alert-success mt-3 mb-0">✅ Review submitted. Thank you!</div>}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {project.freelancer ? (
            <div className="sb-card p-4 mb-4">
              <h6 className="fw-bold mb-3">Assigned Freelancer</h6>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.2rem" }}>
                  {project.freelancer.name?.charAt(0)}
                </div>
                <div><div className="fw-semibold">{project.freelancer.name}</div></div>
              </div>
              <Link to={`/owner/chat/${project.freelancer._id}`} className="btn btn-primary w-100">
                💬 Message Freelancer
              </Link>
            </div>
          ) : (
            <div className="sb-card p-4 mb-4">
              <h6 className="fw-bold mb-3">Status</h6>
              <p className="text-muted small">No freelancer hired yet. Accept a proposal from the list to assign one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal show={reviewModal} onHide={() => setReviewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleReview}>
            <div className="mb-4">
              <label className="form-label fw-semibold">Rating</label>
              <div className="star-rating d-flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`star ${s <= rating ? "filled" : ""}`}
                    onClick={() => setRating(s)} style={{ fontSize: "2rem", cursor: "pointer" }}>★</span>
                ))}
              </div>
              <small className="text-muted">{rating} star{rating !== 1 ? "s" : ""}</small>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Your Review</label>
              <textarea className="form-control" rows={4} placeholder="Share your experience working with this freelancer..."
                value={comment} onChange={e => setComment(e.target.value)} required />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => setReviewModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary fw-semibold">Submit Review</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

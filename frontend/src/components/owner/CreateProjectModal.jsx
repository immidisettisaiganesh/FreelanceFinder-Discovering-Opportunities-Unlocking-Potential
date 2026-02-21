import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { createProject, updateProject } from "../../services/projectService";
import { getCategoryList } from "../../services/categoryService";
import toast from "react-hot-toast";

export default function CreateProjectModal({ show, onClose, onSuccess, editData }) {
  const [form, setForm] = useState({ title: "", description: "", budget: "", deadline: "", category: "", tags: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategoryList().then(d => setCategories(d.categories || [])).catch(() => {});
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
        budget: editData.budget || "",
        deadline: editData.deadline ? editData.deadline.split("T")[0] : "",
        category: editData.category?._id || "",
        tags: (editData.tags || []).join(", "),
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [], budget: Number(form.budget) };
    try {
      if (editData) { await updateProject({ id: editData._id, data: payload }); toast.success("Project updated!"); }
      else { await createProject(payload); toast.success("Project posted!"); }
      onSuccess(); onClose();
    } catch (e) { toast.error(e?.response?.data?.message || "Error saving project"); }
    finally { setLoading(false); }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">{editData ? "Edit Project" : "Post New Project"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Project Title *</label>
              <input className="form-control" placeholder="e.g. Logo Design for Bakery" value={form.title}
                onChange={e => setForm({...form, title: e.target.value})} required minLength={10} />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description *</label>
              <textarea className="form-control" rows={4} placeholder="Describe your project in detail..." value={form.description}
                onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category *</label>
              <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Budget (USD) *</label>
              <input type="number" className="form-control" placeholder="e.g. 500" value={form.budget}
                onChange={e => setForm({...form, budget: e.target.value})} required min={1} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Deadline *</label>
              <input type="date" className="form-control" value={form.deadline}
                onChange={e => setForm({...form, deadline: e.target.value})} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Tags (comma separated)</label>
              <input className="form-control" placeholder="e.g. logo, branding, design" value={form.tags}
                onChange={e => setForm({...form, tags: e.target.value})} />
            </div>
            <div className="col-12 d-flex gap-2 justify-content-end mt-2">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary fw-semibold px-4" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"/> : null}
                {editData ? "Update Project" : "Post Project"}
              </button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

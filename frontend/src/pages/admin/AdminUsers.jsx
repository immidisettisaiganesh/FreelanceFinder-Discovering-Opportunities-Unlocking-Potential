import { useState, useEffect } from "react";
import { getUsersApi, changeUserStatusApi } from "../../services/authService";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => { getUsersApi().then(d => setUsers(d.users || [])).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleStatus = async (userId, status) => {
    try {
      await changeUserStatusApi({ userId, data: { status } });
      toast.success("User status updated"); setSelected(null); load();
    } catch { toast.error("Error updating status"); }
  };

  const filtered = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.phoneNumber || "").includes(search)
  );

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1">User Management</h4><p className="text-muted mb-0">Approve, reject or suspend users</p></div>
      </div>
      <div className="mb-3">
        <input className="form-control" placeholder="🔍 Search by name, email or phone..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
        <div className="sb-card overflow-hidden">
          <table className="table mb-0">
            <thead className="table-light">
              <tr><th>User</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{width:36,height:36,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:"0.9rem",flexShrink:0}}>
                        {u.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="fw-semibold">{u.name || "—"}</div>
                        <small className="text-muted">{u.email || "—"}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge bg-secondary">{u.role}</span></td>
                  <td><small>{u.phoneNumber || "—"}</small></td>
                  <td><span className={`badge ${u.status===2?"badge-approved":u.status===0?"badge-rejected":"badge-pending"} px-3 py-2`}>
                    {u.status===2?"Approved":u.status===0?"Rejected":"Pending"}
                  </span></td>
                  <td><small className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</small></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(u)}>Change Status</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {selected && (
        <Modal show onHide={() => setSelected(null)} centered>
          <Modal.Header closeButton><Modal.Title className="fw-bold">Change User Status</Modal.Title></Modal.Header>
          <Modal.Body>
            <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
              <div style={{width:48,height:48,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:"1.2rem"}}>
                {selected.name?.charAt(0) || "?"}
              </div>
              <div>
                <div className="fw-bold">{selected.name || "—"}</div>
                <small className="text-muted">{selected.email} · {selected.role}</small>
              </div>
            </div>
            <p className="text-muted small mb-3">Select the new status for this user:</p>
            <div className="d-grid gap-2">
              <button className="btn btn-success fw-semibold" onClick={() => handleStatus(selected._id, 2)}>✓ Approve User</button>
              <button className="btn btn-warning fw-semibold" onClick={() => handleStatus(selected._id, 1)}>⏳ Set to Pending</button>
              <button className="btn btn-danger fw-semibold" onClick={() => handleStatus(selected._id, 0)}>✗ Reject User</button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

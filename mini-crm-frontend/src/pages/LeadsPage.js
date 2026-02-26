import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['New', 'In Progress', 'Converted', 'Lost'];

export default function LeadsPage() {
  const { logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id: null,
    customer_name: '',
    email: '',
    phone: '',
    status: 'New'
  });
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const response = await api.get('/leads', { params });
      setLeads(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load leads';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      id: null,
      customer_name: '',
      email: '',
      phone: '',
      status: 'New'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name) return;
    setSaving(true);
    setError('');

    try {
      if (form.id) {
        await api.put(`/leads/${form.id}`, form);
      } else {
        await api.post('/leads', form);
      }
      resetForm();
      fetchLeads();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save lead';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lead) => {
    setForm({
      id: lead.id,
      customer_name: lead.customer_name,
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    setError('');
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete lead';
      setError(message);
    }
  };

  const statusClass = (status) => {
    if (status === 'New') return 'status-pill status-pill--new';
    if (status === 'In Progress') return 'status-pill status-pill--progress';
    if (status === 'Converted') return 'status-pill status-pill--converted';
    if (status === 'Lost') return 'status-pill status-pill--lost';
    return 'status-pill';
  };

  return (
    <div className="card">
      <div className="card-sidebar">
        <div className="card-sidebar-inner">
          <div className="logo-row">
            <div className="logo-mark">M</div>
            <div>
              <div className="logo-text-main">Mini CRM</div>
              <div className="logo-text-sub">Lead cockpit</div>
            </div>
          </div>
          <div className="sidebar-title">
            Leads, owners,
            <br />
            and pipeline in one grid.
          </div>
          <div className="sidebar-subtitle">
            Add new opportunities, tweak statuses, and jump into followups without hunting through
            menus.
          </div>
          <div className="pill-row">
            <span className="pill pill--accent">Filter by status</span>
            <span className="pill">Search by name or email</span>
            <span className="pill">Timeline followups</span>
          </div>
          <div className="sidebar-footer">
            <span>
              <strong>Tip:</strong> Use the quick filters to demo status changes live.
            </span>
            <span>
              <Link to="/">Back to dashboard</Link>
            </span>
          </div>
        </div>
      </div>
      <div className="card-main">
        <div className="top-bar">
          <div>
            <div className="top-bar-title">Leads</div>
            <div className="top-bar-sub">Manage your pipeline.</div>
          </div>
          <div className="top-bar-actions">
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <div className="layout">
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Lead form</div>
                <div className="panel-sub">
                  {form.id ? 'Editing existing lead.' : 'Create a new lead.'}
                </div>
              </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label>Customer name</label>
                <input
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div className="field-group">
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@acme.com"
                  />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pill-input-row">
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : form.id ? 'Update lead' : 'Add lead'}
                </button>
                {form.id && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Lead list</div>
                <div className="panel-sub">Filter, search, and jump into followups.</div>
              </div>
            </div>
            <div className="chip-row" style={{ marginBottom: 8 }}>
              <span
                className={`chip ${statusFilter === '' ? 'chip--active' : ''}`}
                onClick={() => setStatusFilter('')}
              >
                All
              </span>
              {STATUS_OPTIONS.map((status) => (
                <span
                  key={status}
                  className={`chip ${statusFilter === status ? 'chip--active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </span>
              ))}
            </div>
            <div className="field" style={{ marginBottom: 8 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or phone"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    fetchLeads();
                  }
                }}
              />
              <div className="helper-text">Press Enter to apply search.</div>
            </div>
            {loading && <div className="badge">Loading leads…</div>}
            {!loading && (
              <div className="lead-table-wrapper">
                <table className="table table--compact">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.customer_name}</td>
                        <td className="table-contact">
                          <div>{lead.email}</div>
                          <div className="text-muted">{lead.phone}</div>
                        </td>
                        <td>
                          <span className={statusClass(lead.status)}>{lead.status}</span>
                        </td>
                        <td className="table-actions">
                          <div className="table-actions-inner">
                            <button
                              className="btn-icon"
                              type="button"
                              onClick={() => handleEdit(lead)}
                            >
                              Edit
                            </button>
                            <Link to={`/followups/${lead.id}`}>
                              <button className="btn-icon btn-icon--primary" type="button">
                                Followups
                              </button>
                            </Link>
                            <button
                              className="btn-icon btn-icon--danger"
                              type="button"
                              onClick={() => handleDelete(lead.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && !loading && (
                      <tr>
                        <td colSpan="4" className="text-muted">
                          No leads yet. Add your first one on the left.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

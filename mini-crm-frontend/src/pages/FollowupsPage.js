import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FollowupsPage() {
  const { leadId } = useParams();
  const { logout } = useAuth();
  const [followups, setFollowups] = useState([]);
  const [lead, setLead] = useState(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [leadRes, followRes] = await Promise.all([
        api.get('/leads', { params: { search: leadId } }),
        api.get(`/followups/${leadId}`)
      ]);
      setLead(leadRes.data.data?.[0] || null);
      setFollowups(followRes.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load followups';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return;
    setSaving(true);
    setError('');

    try {
      await api.post('/followups', {
        lead_id: leadId,
        followup_date: date,
        notes
      });
      setDate('');
      setNotes('');
      fetchData();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add followup';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-sidebar">
        <div className="card-sidebar-inner">
          <div className="logo-row">
            <div className="logo-mark">M</div>
            <div>
              <div className="logo-text-main">Mini CRM</div>
              <div className="logo-text-sub">Followup stream</div>
            </div>
          </div>
          <div className="sidebar-title">
            Never lose a lead
            <br />
            to a missed followup.
          </div>
          <div className="sidebar-subtitle">
            Lightweight timeline: add future touchpoints and see what&apos;s already happened.
          </div>
          <div className="sidebar-footer">
            <span>
              <Link to="/leads">Back to leads</Link>
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
            <div className="top-bar-title">Followups</div>
            <div className="top-bar-sub">
              {lead ? `Lead: ${lead.customer_name}` : 'Loading lead details…'}
            </div>
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
                <div className="panel-title">Add followup</div>
                <div className="panel-sub">Schedule your next touchpoint.</div>
              </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label>Followup date</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Notes</label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What will you discuss? Any context?"
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Add followup'}
              </button>
            </form>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Timeline</div>
                <div className="panel-sub">Most recent followups at the top.</div>
              </div>
            </div>
            {loading && <div className="badge">Loading followups…</div>}
            {!loading && (
              <ul className="timeline">
                {followups.map((item) => (
                  <li key={item.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-body">
                      <strong>
                        {new Date(item.followup_date).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </strong>
                      <br />
                      {item.notes || 'No notes added.'}
                    </div>
                  </li>
                ))}
                {followups.length === 0 && (
                  <li className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-body">
                      <strong>No followups yet.</strong>
                      <br />
                      Add your first touchpoint on the left.
                    </div>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

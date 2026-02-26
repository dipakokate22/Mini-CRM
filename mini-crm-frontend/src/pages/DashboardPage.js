import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to load dashboard';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!stats || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = stats.byStatus?.map((item) => item.status) || [];
    const data = stats.byStatus?.map((item) => Number(item.dataValues?.count || item.count)) || [];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#60a5fa', '#fbbf24', '#4ade80', '#f97373'],
            borderWidth: 0
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e5e7eb',
              boxWidth: 10
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [stats]);

  return (
    <div className="card">
      <div className="card-sidebar">
        <div className="card-sidebar-inner">
          <div className="logo-row">
            <div className="logo-mark">M</div>
            <div>
              <div className="logo-text-main">Mini CRM</div>
              <div className="logo-text-sub">Simple CRM, recruiter-ready UI</div>
            </div>
          </div>
          <div className="sidebar-title">
            Hi {user?.name || 'there'},
            <br />
            your pipeline at a glance.
          </div>
          <div className="sidebar-subtitle">
            Track leads, followups, and conversion without leaving a single view. JWT-secured
            backend with MySQL under the hood.
          </div>
          <div className="sidebar-metrics">
            <div className="metric">
              <div className="metric-label">Total leads</div>
              <div className="metric-value">{stats?.totalLeads ?? '—'}</div>
              <div className="metric-trend">
                {stats ? `${stats.convertedLeads} converted` : 'Loading…'}
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Conversion</div>
              <div className="metric-value">{stats ? `${stats.conversionRate}%` : '—'}</div>
              <div className="helper-text">vs. lost leads</div>
            </div>
          </div>
          <div className="sidebar-footer">
            <span>
              <strong>Role:</strong> {user?.role}
            </span>
            <span>
              <strong>Tech stack:</strong> Node · Express · Sequelize · MySQL · React
            </span>
          </div>
        </div>
      </div>
      <div className="card-main">
        <div className="top-bar">
          <div>
            <div className="top-bar-title">Dashboard</div>
            <div className="top-bar-sub">Overview of your leads and outcomes.</div>
          </div>
          <div className="top-bar-actions">
            <Link to="/leads">
              <button className="btn btn-primary">Open Leads</button>
            </Link>
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="layout">
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Funnel snapshot</div>
                <div className="panel-sub">Breakdown of leads by status.</div>
              </div>
            </div>
            {loading && <div className="badge">Loading stats…</div>}
            {error && !loading && <div className="alert alert-error">{error}</div>}
            {!loading && !error && (
              <div style={{ height: 260 }}>
                <canvas ref={chartRef} />
              </div>
            )}
          </div>
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Pipeline health</div>
                <div className="panel-sub">Quick health check of your current funnel.</div>
              </div>
            </div>
            <ul className="timeline">
              <li className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <strong>Converted leads</strong>
                  <br />
                  {stats?.convertedLeads ?? '—'} deals moved to closed-won.
                </div>
              </li>
              <li className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <strong>Lost leads</strong>
                  <br />
                  {stats?.lostLeads ?? '—'} marked as closed-lost.
                </div>
              </li>
              <li className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <strong>Conversion rate</strong>
                  <br />
                  {stats ? `${stats.conversionRate}%` : '—'} of leads are converting.
                </div>
              </li>
              <li className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <strong>Next steps</strong>
                  <br />
                  Jump into the Leads view to assign owners and add followups.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

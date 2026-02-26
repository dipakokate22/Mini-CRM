import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Sales User');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await api.post('/auth/register', { name, email, password, role });
        setMode('login');
      } else {
        const response = await api.post('/auth/login', { email, password });
        login(response.data.token, response.data.user);
        navigate('/');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="card">
      <div className="card-sidebar">
        <div className="card-sidebar-inner">
          <div className="logo-row">
            <div className="logo-mark">M</div>
            <div>
              <div className="logo-text-main">Mini CRM</div>
              <div className="logo-text-sub">Recruiter-friendly lead cockpit</div>
            </div>
          </div>
          <div className="sidebar-title">
            Pipeline clarity,
            <br />
            zero bloat.
          </div>
          <div className="sidebar-subtitle">
            Minimal CRM built with Node, MySQL, and React to showcase clean code and UI taste.
          </div>
          <div className="pill-row">
            <span className="pill pill--accent">JWT Auth</span>
            <span className="pill">Lead Tracking</span>
            <span className="pill">Followups</span>
            <span className="pill">Dashboard Analytics</span>
          </div>
          <div className="sidebar-metrics">
            <div className="metric">
              <div className="metric-label">Time to setup</div>
              <div className="metric-value">~5 min</div>
              <div className="metric-trend">npm start & go</div>
            </div>
            <div className="metric">
              <div className="metric-label">Stack</div>
              <div className="metric-value">MERNish</div>
              <div className="helper-text">Node · MySQL · React</div>
            </div>
          </div>
          <div className="sidebar-footer">
            <span>
              <strong>Tip:</strong> Try registering a Sales User and an Admin to demo roles.
            </span>
            <span>Designed to be readable even for freshers.</span>
          </div>
        </div>
      </div>
      <div className="card-main">
        <div className="top-bar">
          <div>
            <div className="top-bar-title">{isLogin ? 'Welcome back' : 'Create your workspace'}</div>
            <div className="top-bar-sub">
              {isLogin ? 'Sign in to your mini CRM dashboard.' : 'Register a new account.'}
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">{isLogin ? 'Sign in' : 'Sign up'}</div>
            <div className="badge badge--pill">
              {isLogin ? 'JWT + MySQL session' : 'Password hashed with bcrypt'}
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <form className="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Recruiter"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {!isLogin && (
              <div className="field">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Sales User">Sales User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>
          <div className="auth-toggle">
            {isLogin ? (
              <>
                New here?{' '}
                <button type="button" onClick={() => setMode('register')}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

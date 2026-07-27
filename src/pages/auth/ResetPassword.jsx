import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={containerStyle}>
        <div style={formCardStyle}>
          <h1>Invalid Reset Link</h1>
          <p>This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" style={{ color: '#667eea' }}>Request a new link</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={containerStyle}>
        <div style={formCardStyle}>
          <h1>Password Reset</h1>
          <p>Your password has been successfully reset.</p>
          <Link to="/login" style={{ color: '#667eea' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h1>Reset Password</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#667eea' }}>&larr; Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' };
const formCardStyle = { width: '100%', maxWidth: 420, padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const fieldStyle = { marginBottom: '1rem' };
const inputStyle = { width: '100%', padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '0.75rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 };

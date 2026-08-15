import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState('');
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const token = searchParams.get('token');
    if (!token) {
      setError('Sign-in failed: no token received from Google.');
      return;
    }

    loginWithToken(token)
      .then((profile) => navigate(profile?.role === 'ADMIN' ? '/admin' : '/', { replace: true }))
      .catch((err) => {
        setError(err.response?.data?.message || err.message || 'Sign-in failed.');
      });
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h1>{error ? 'Sign-in Failed' : 'Signing You In...'}</h1>
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
        {!error && <p style={{ color: '#666' }}>Please wait, completing your Google login...</p>}
      </div>
    </div>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' };
const formCardStyle = { width: '100%', maxWidth: 420, padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' };

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
    <div className="flex justify-center items-center min-h-[80vh] p-8">
      <div className="w-full max-w-[420px] p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{error ? 'Sign-in Failed' : 'Signing You In...'}</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!error && <p className="text-gray-500">Please wait, completing your Google login...</p>}
      </div>
    </div>
  );
}

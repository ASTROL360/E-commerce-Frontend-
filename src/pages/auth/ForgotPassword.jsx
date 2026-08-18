import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import authService from '../../services/authService';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
});

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Check Your Email</h1>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4l-10 8L2 4" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm text-center mb-2">
            If an account exists with <strong>{submittedEmail}</strong>, we have sent a 6-digit PIN to that email address.
          </p>
          <p className="text-gray-400 text-xs text-center mb-6">
            The PIN expires in 5 minutes.
          </p>
          <Link to={`/reset-password?email=${encodeURIComponent(submittedEmail)}`} className="block text-center text-primary font-semibold hover:underline text-sm">
            Enter PIN &rarr;
          </Link>
          <div className="text-sm text-center mt-4 text-gray-600">
            <button onClick={() => setSubmitted(false)} className="text-primary font-semibold hover:underline">
              Wrong email? Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Forgot Password</h1>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <p className="text-gray-600 text-sm mb-6">Enter your email and we'll send you a 6-digit PIN to reset your password.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            {errors.email && <p className="text-danger text-sm mt-1">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Sending...' : 'Send PIN'}
          </button>
        </form>
        <div className="text-sm text-center mt-4 text-gray-600">
          <Link to="/login" className="text-primary font-semibold hover:underline">&larr; Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

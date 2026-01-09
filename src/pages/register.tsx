// src/pages/register.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Register the user using the auth context
      await register({ email, password });
      // Redirect to dashboard after successful registration and login
      router.push('/dashboard');
    } catch (err: any) {
      // Check if it's a 409 conflict error (user already exists)
      if (err.response?.status === 409) {
        setError(err.response?.data?.detail || 'A user with this email already exists');
      } else {
        setError(err.response?.data?.detail || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-md p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-poppins">
            TaskBox
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-inter">
            Your smart companion for tasks & chats
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-pink-200 placeholder-pink-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent focus:z-10 sm:text-sm font-inter"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-pink-200 placeholder-pink-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent focus:z-10 sm:text-sm mt-3 font-inter"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-pink-200 placeholder-pink-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent focus:z-10 sm:text-sm mt-3 font-inter"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 shadow-sm disabled:opacity-50 font-inter"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>

            <div className="text-center pt-2">
              <a
                href="/login"
                className="font-medium text-pink-500 hover:text-pink-600 transition-colors duration-200 font-inter"
              >
                Already have an account? Sign in
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, type }),
      });
      if (res.ok) alert('Signup successful!');
      else alert('Signup failed');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, type }),
      });
      if (res.ok) alert('Login successful!');
      else alert('Login failed');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={isLogin ? handleLogin : handleSignup} className="w-96 p-8 border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">{type === 'driver' ? 'Driver' : 'Customer'} {isLogin ? 'Login' : 'Sign Up'}</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" required />
        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">{loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}</button>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-500 underline">{isLogin ? 'Sign Up' : 'Login'}</button>
        </p>
      </form>
    </div>
  );
}

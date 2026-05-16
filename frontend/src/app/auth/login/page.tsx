'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [form, setForm]    = useState({ email: '', password: '' });
  const [error, setError]  = useState('');
  const [loading, setLoad] = useState(false);
  const { login }          = useAuth();
  const router             = useRouter();

  const handleSubmit = async () => {
    setLoad(true); setError('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, form);
      login(res.data.token, res.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally { setLoad(false); }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold text-center mb-2 text-blue-600">Welcome Back 👋</h1>
      <p className="text-center text-gray-400 text-sm mb-6">Login to your account</p>
      {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded-lg">{error}</p>}
      <input
        className="w-full border rounded-lg p-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="email" placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input
        className="w-full border rounded-lg p-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="password" placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
      <button
        onClick={handleSubmit} disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium">
        {loading ? 'Loading...' : 'Login'}
      </button>
      <p className="text-center text-sm mt-4 text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">Register</Link>
      </p>
    </div>
  );
}

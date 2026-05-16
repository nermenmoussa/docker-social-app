'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';

export default function CreatePost({ onPost }: { onPost: (post: Post) => void }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim() || !token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPost(res.data);
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 text-center text-gray-400 text-sm">
      <a href="/auth/login" className="text-blue-600 hover:underline">Login</a> to create a post
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <textarea
          className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}

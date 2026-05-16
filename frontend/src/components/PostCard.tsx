'use client';
import { useState } from 'react';
import axios from 'axios';
import { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PostCard({ post: initial, onDelete }: { post: Post; onDelete?: (id: string) => void }) {
  const [post, setPost]         = useState(initial);
  const [comment, setComment]   = useState('');
  const [showComments, setShow] = useState(false);
  const { user, token }         = useAuth();

  const handleLike = async () => {
    if (!token) return;
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPost(p => ({ ...p, likes: res.data }));
  };

  const handleComment = async () => {
    if (!comment.trim() || !token) return;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}/comment`,
      { text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPost(p => ({ ...p, comments: res.data }));
    setComment('');
  };

  const handleDelete = async () => {
    if (!token) return;
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${post._id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onDelete?.(post._id);
  };

  const liked = user ? post.likes.includes(user.id) : false;
  const isOwner = user?.id === post.user._id;

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            {post.user.name[0].toUpperCase()}
          </div>
          <div>
            <Link href={`/profile/${post.user._id}`}
              className="font-semibold text-sm hover:text-blue-600">
              {post.user.name}
            </Link>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isOwner && (
          <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600">
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

      {/* Actions */}
      <div className="flex gap-4 text-sm text-gray-500 border-t pt-3">
        <button onClick={handleLike}
          className={`flex items-center gap-1 hover:text-red-500 transition ${liked ? 'text-red-500' : ''}`}>
          {liked ? '❤️' : '🤍'} {post.likes.length}
        </button>
        <button onClick={() => setShow(!showComments)}
          className="flex items-center gap-1 hover:text-blue-500 transition">
          💬 {post.comments.length}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 border-t pt-3">
          {post.comments.length === 0 && (
            <p className="text-xs text-gray-400 mb-2">No comments yet</p>
          )}
          {post.comments.map(c => (
            <div key={c._id} className="text-sm mb-2 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-semibold">{c.user.name}: </span>
              <span className="text-gray-700">{c.text}</span>
            </div>
          ))}
          {user && (
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 border rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
              />
              <button onClick={handleComment}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition">
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

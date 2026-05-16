'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { User, Post } from '@/types';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { id }                  = useParams();
  const [profile, setProfile]   = useState<User | null>(null);
  const [posts, setPosts]       = useState<Post[]>([]);
  const [loading, setLoad]      = useState(true);
  const { user }                = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/user/${id}`)
        ]);
        setProfile(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center text-gray-400 py-10">Loading...</div>;
  if (!profile) return <div className="text-center text-gray-400 py-10">User not found</div>;

  const isMe = user?.id === id;

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {profile.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <p className="text-gray-400 text-sm">{profile.email}</p>
            {profile.bio && <p className="text-gray-600 text-sm mt-1">{profile.bio}</p>}
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm text-gray-500">
          <span><strong>{posts.length}</strong> posts</span>
          {isMe && <span className="text-blue-500 cursor-pointer">✏️ Edit Profile</span>}
        </div>
      </div>

      {/* User Posts */}
      <h2 className="font-semibold text-gray-600 mb-3">Posts</h2>
      {posts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No posts yet</div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={id => setPosts(p => p.filter(x => x._id !== id))}
          />
        ))
      )}
    </div>
  );
}

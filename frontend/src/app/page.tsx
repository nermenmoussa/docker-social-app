'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';

export default function Home() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoad(false));
  }, []);

  return (
    <div>
      <CreatePost onPost={post => setPosts(p => [post, ...p])} />
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No posts yet. Be the first! 🎉
        </div>
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

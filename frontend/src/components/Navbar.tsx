'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          SocialApp
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href={`/profile/${user.id}`}
                className="text-sm text-gray-700 hover:text-blue-600 font-medium">
                👤 {user.name}
              </Link>
              <button onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login"
                className="text-sm text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link href="/auth/register"
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

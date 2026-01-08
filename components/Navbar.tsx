'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import SignOutButton from './SignOutButton';

export default function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <p className="text-2xl font-bold text-indigo-600">SaaS</p>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link href="/products">
                <p className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  Products
                </p>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {!loading &&
              (user ? (
                <>
                  <Link href="/account">
                    <p className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      Account
                    </p>
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/signin">
                    <p className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      Sign In
                    </p>
                  </Link>
                  <Link href="/signup">
                    <p className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Sign Up
                    </p>
                  </Link>
                </>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

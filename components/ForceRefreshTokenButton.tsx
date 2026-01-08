'use client';

import { useAuth } from '@/hooks/useAuth';

export default function ForceRefreshTokenButton() {
  const { auth } = useAuth();

  const handleForceRefresh = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.getIdToken(true);
        console.log('Token refreshed successfully!');
        alert('Token refreshed successfully!');
      } catch (error) {
        console.error('Error refreshing token:', error);
        alert('Error refreshing token, check the console for more details.');
      }
    }
  };

  return (
    <button
      onClick={handleForceRefresh}
      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Force Refresh Token
    </button>
  );
}

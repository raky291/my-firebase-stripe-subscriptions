'use client';

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default function ManageSubscriptionButton() {
  const [portalLoading, setPortalLoading] = useState(false);

  const handleCreatePortalLink = async () => {
    setPortalLoading(true);
    try {
      const functions = getFunctions();
      const createPortalLink = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');
      const { data }: any = await createPortalLink({
        returnUrl: window.location.origin + '/account',
      });
      window.location.assign(data.url);
    } catch (error) {
      console.error("Error creating portal link:", error);
      setPortalLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreatePortalLink}
      disabled={portalLoading}
      className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {portalLoading ? 'Loading...' : 'Manage Subscription'}
    </button>
  );
}

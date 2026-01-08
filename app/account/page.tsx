'use client';

import { useAuth } from '@/hooks/useAuth';
import SignOutButton from '@/components/SignOutButton';
import ForceRefreshTokenButton from '@/components/ForceRefreshTokenButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IdTokenResult } from 'firebase/auth';
import { getCurrentUserSubscriptions, Subscription } from '@invertase/firestore-stripe-payments';
import { payments } from '@/lib/stripe';
import ManageSubscriptionButton from '@/components/ManageSubscriptionButton';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tokenResult, setTokenResult] = useState<IdTokenResult | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const result = await user.getIdTokenResult();
        setTokenResult(result);
      }
    };
    fetchToken();
  }, [user]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user) {
        try {
          const subs = await getCurrentUserSubscriptions(payments, {
            status: 'active',
          });
          setSubscription(subs[0] || null);
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
        } finally {
          setSubscriptionsLoading(false);
        }
      } else {
        setSubscriptionsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  if (loading || subscriptionsLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Your Account
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
              <div className="mt-2 border-t border-gray-200 pt-2">
                <dl className="divide-y divide-gray-200">
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Display Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.displayName || 'Not set'}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email || 'Not set'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Token Information</h3>
              <div className="mt-2 border-t border-gray-200 pt-2">
                <dl className="divide-y divide-gray-200">
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Sign-in Provider</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tokenResult?.signInProvider || 'Not set'}</dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Stripe Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{tokenResult?.claims.stripeRole as string || 'Not set'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription Information</h3>
              <div className="mt-2 border-t border-gray-200 pt-2">
                <dl className="divide-y divide-gray-200">
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Current Period End</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {subscription?.current_period_end || 'Not set'}
                    </dd>
                  </div>
                  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{subscription?.status || 'Not set'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <SignOutButton />
              <ForceRefreshTokenButton />
              <ManageSubscriptionButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

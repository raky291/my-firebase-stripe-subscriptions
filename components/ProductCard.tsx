'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@invertase/firestore-stripe-payments';
import { payments } from '@/lib/stripe';

interface Product {
  id: string;
  name: string;
  description: string;
  prices: { priceId: string; unit_amount: number }[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      router.push('/signin');
      return;
    }

    setLoading(true);

    try {
      const session = await createCheckoutSession(payments, {
        price: priceId,
        mode: 'subscription',
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cancel`,
      });
      window.location.assign(session.url);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Error creating checkout session. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="group relative border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.description}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          ${(product.prices[0].unit_amount / 100).toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => handleCheckout(product.prices[0].priceId)}
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </button>
    </div>
  );
}

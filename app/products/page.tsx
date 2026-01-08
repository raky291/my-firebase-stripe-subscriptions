'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  prices: { priceId: string; unit_amount: number }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const productsCollection = collection(db, 'products');
      const q = query(productsCollection, where('active', '==', true));
      const querySnapshot = await getDocs(q);
      const productsData: Product[] = [];

      for (const doc of querySnapshot.docs) {
        const product: Product = {
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          prices: [],
        };

        const pricesCollection = collection(doc.ref, 'prices');
        const pricesSnapshot = await getDocs(pricesCollection);

        pricesSnapshot.forEach((priceDoc) => {
          product.prices.push({
            priceId: priceDoc.id,
            unit_amount: priceDoc.data().unit_amount,
          });
        });

        productsData.push(product);
      }

      setProducts(productsData);
      console.log("products:", productsData);
      setLoading(false);
    };

    getProducts();
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Products
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

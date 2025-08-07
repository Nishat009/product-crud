'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProductById } from '@/redux/productSlice';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const productId = id ? Number(id) : 0;

  const product = useAppSelector((state) =>
    state.products.products.find((p) => p.id === productId)
  );
  const loading = useAppSelector((state) => state.products.loading);

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, product, productId]);

  if (loading || !product) return <p className="p-4 text-center">Loading product details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-72 object-cover rounded mb-4"
        />
      )}
      <p className="mb-2 font-semibold">Category: {product.category?.name}</p>
      <p className="mb-2 text-green-700 font-bold">${product.price}</p>
      <p className="text-gray-700">{product.description}</p>
    </div>
  );
}

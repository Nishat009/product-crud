'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProductById } from '@/redux/productSlice';
import ProductDetail from '@/components/ProductDetail';

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
      <ProductDetail product={product} />
    </div>
  );
}

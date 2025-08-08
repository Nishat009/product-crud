'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProductById } from '@/redux/productSlice';
import ProductForm from '@/components/ProductForm';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams(); // Get product ID from URL
  const { products, loading, error } = useAppSelector((state) => state.products);

  // Find the product in the Redux state (from products or localProducts)
  const product = products.find((p) => p.id === Number(id));

  // Fetch product if not found in state
  useEffect(() => {
    if (!product && id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id, product]);

  if (loading) {
    return <div className="max-w-xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-xl mx-auto p-6 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="max-w-xl mx-auto p-6">Product not found</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm product={product} isEdit={true} />
    </div>
  );
}
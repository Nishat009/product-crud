'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProductById } from '@/redux/productSlice';
import ProductDetail from '@/components/ProductDetail';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const productId = id ? Number(id) : undefined;
  const { products, loading, error } = useAppSelector((state) => state.products);

  // Find product locally first
  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    if (productId && !product) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId, product]);

  if (loading) return <p className="p-4 text-center">Loading product details...</p>;
  if (error) return <p className="p-4 text-center text-red-600">Error: {error}</p>;
  if (!product) return <p className="p-4 text-center">Product not found.</p>;

  return <ProductDetail product={product} />;
}

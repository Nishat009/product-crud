'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProductById } from '@/redux/productSlice';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const productId = id ? Number(id) : 0;

  const product = useAppSelector((state) =>
    state.products.products.find((p) => p.id === productId)
  );
  const loading = useAppSelector((state) => state.products.loading);

  const [loadingLocal, setLoadingLocal] = useState(true);

  useEffect(() => {
    async function load() {
      if (!product) {
        await dispatch(fetchProductById(productId));
      }
      setLoadingLocal(false);
    }
    load();
  }, [dispatch, productId, product]);

  if (loading || loadingLocal || !product) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm product={product} isEdit />
    </div>
  );
}

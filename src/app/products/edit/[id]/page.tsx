'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProductById, fetchCategories } from '@/redux/productSlice';
import ProductForm from '@/components/ProductForm';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { products, loading, error, categories, categoriesLoading } = useAppSelector((state) => state.products);

  const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    console.log('EditProductPage - ID:', id, 'Product:', product, 'Categories:', categories);
    if (!categories.length && !categoriesLoading) {
      console.log('Fetching categories...');
      dispatch(fetchCategories());
    }
    if (!product && id && !loading) {
      console.log('Fetching product by ID:', id);
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id, product, categories, categoriesLoading, loading]);

  if (loading || categoriesLoading) {
    return <div className="max-w-xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-xl mx-auto p-6 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="max-w-xl mx-auto p-6">Product not found</div>;
  }

  if (!categories.length) {
    return <div className="max-w-xl mx-auto p-6">Categories not loaded</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm product={product} isEdit={true} />
    </div>
  );
}
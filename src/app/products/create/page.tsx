'use client';

import React from 'react';
import ProductForm from '@/components/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <ProductForm />
    </div>
  );
}

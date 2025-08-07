'use client';

import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/store';
import { createProduct } from '@/redux/productSlice';
import ProductForm from '@/components/ProductForm';

export default function CreateProductPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCreateProduct = async (data: {
    title: string;
    price: number;
    category: string;
    description?: string;
    images?: string[];
  }) => {
    try {
      await dispatch(createProduct(data)).unwrap();
      router.push('/');
    } catch (error) {
      alert('Failed to create product.');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}

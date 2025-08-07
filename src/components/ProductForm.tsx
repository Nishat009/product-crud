'use client';

import React, { useState, useEffect } from 'react';
import { Product, addProduct, editProduct } from '@/redux/productSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

interface FormData {
  title: string;
  price: string;
  description: string;
  category: string;
  imageUrl: string;
}

export default function ProductForm({ product, isEdit }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, categoriesLoading, categoriesError } = useAppSelector((state) => state.products);

  const [form, setForm] = useState<FormData>({
    title: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.category?.name || '',
        imageUrl: product.images?.[0] || '',
      });
    }
  }, [product]);

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Title is required';
    if (form.title.length > 100) return 'Title max length is 100 characters';
    if (!form.category.trim()) return 'Category is required';
    if (form.category.length > 50) return 'Category max length is 50 characters';
    if (!form.price.trim()) return 'Price is required';
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) return 'Price must be a positive number';
    if (form.description.length > 500) return 'Description max length is 500 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

   const categoryObj = { id: 1, name: form.category };
const productData: Partial<Product> = {
  title: form.title,
  price: Number(form.price),
  description: form.description,
  category: categoryObj,
  images: form.imageUrl ? [form.imageUrl] : [],
};

    if (isEdit && product) {
      await dispatch(editProduct({ ...productData, id: product.id } as Product));
    } else {
      await dispatch(addProduct(productData));
    }

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded shadow bg-white">
      <div>
        <label className="block mb-1 font-semibold">Title *</label>
        <input
          type="text"
          maxLength={100}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border px-3 py-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Category *</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border px-3 py-2 w-full rounded"
          required
          disabled={categoriesLoading}
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {categoriesError && <p className="text-red-600">{categoriesError}</p>}
      </div>
      <div>
        <label className="block mb-1 font-semibold">Price *</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border px-3 py-2 w-full rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          maxLength={500}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border px-3 py-2 w-full rounded"
          rows={4}
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Image URL</label>
        <input
          type="text"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="border px-3 py-2 w-full rounded"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {isEdit ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
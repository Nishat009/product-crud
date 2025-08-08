'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, addProduct, editProduct } from '@/redux/productSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ProductForm useEffect - Product:', product, 'Categories:', categories);
    if (product && isEdit) {
      const productCategory = product.category?.slug || product.category?.name || '';
      const validCategory = categories.find((cat) => cat.slug === productCategory || cat.name === productCategory)
        ? productCategory
        : categories.length > 0
        ? categories[0].slug
        : '';
      setForm({
        title: product.title || '',
        price: product.price ? product.price.toString() : '',
        description: product.description || '',
        category: validCategory,
        imageUrl: product.images?.[0] || '',
      });
    } else if (categories.length > 0 && !form.category) {
      setForm((prev) => ({ ...prev, category: categories[0].slug }));
    }
  }, [product, isEdit, categories]);

  const validate = (): string | null => {
    if (!form.title.trim()) return 'Title is required';
    if (form.title.length > 100) return 'Title must be 100 characters or less';
    if (!form.category.trim()) return 'Category is required';
    if (!categories.some((cat: Category) => cat.slug === form.category))
      return 'Please select a valid category';
    if (!form.price.trim()) return 'Price is required';
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) return 'Price must be a positive number';
    if (form.description.length > 500) return 'Description must be 500 characters or less';
    if (form.imageUrl && !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/i.test(form.imageUrl))
      return 'Image URL must be a valid image link (png, jpg, jpeg, gif, webp)';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const error = validate();
    if (error) {
      console.log('Validation error:', error);
      setSubmitError(error);
      toast.error(error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSubmitting(false);
      return;
    }

    try {
      const selectedCategory = categories.find((cat: Category) => cat.slug === form.category);
      console.log('Submitting with category:', selectedCategory);
      const productData: Partial<Product> = {
        title: form.title.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        category: selectedCategory || {
          slug: form.category,
          name: form.category,
          url: `https://dummyjson.com/products/category/${form.category}`,
        },
        images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      };

      if (isEdit && product) {
        console.log('Updating product:', { ...productData, id: product.id });
        const result = await dispatch(editProduct({ ...productData, id: product.id } as Product)).unwrap();
        console.log('Edit product result:', result);
        toast.success('Product updated successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.replace('/');
      } else {
        console.log('Creating product:', productData);
        const result = await dispatch(addProduct(productData)).unwrap();
        console.log('Add product result:', result);
        toast.success('Product created successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        router.replace('/');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save product. Please try again.';
      console.error('Submission error:', err);
      setSubmitError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Create New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded shadow bg-white">
        <div>
          <label className="block mb-1 font-semibold">Title *</label>
          <input
            type="text"
            maxLength={100}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Category *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={categoriesLoading || submitting}
          >
            <option value="" disabled>Select a category</option>
            {categories.length > 0 ? (
              categories.map((cat: Category) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
          {categoriesLoading && <p className="text-gray-600 text-sm mt-1">Loading categories...</p>}
          {categoriesError && <p className="text-red-600 text-sm mt-1">{categoriesError}</p>}
        </div>
        <div>
          <label className="block mb-1 font-semibold">Price *</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            maxLength={500}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Image URL</label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border px-3 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          />
        </div>
        {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
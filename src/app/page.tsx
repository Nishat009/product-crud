'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  fetchProducts,
  fetchCategories,
  setPage,
  setSearchTerm,
  setCategoryFilter,
  deleteProduct,
} from '@/redux/productSlice';
import ProductList from '@/components/ProductList';
import CategoryFilterSidebar from '@/components/CategoryFilterSidebar';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const {
    products,
    loading,
    error,
    page,
    limit,
    total,
    searchTerm,
    categoryFilter,
    categories,
    categoriesLoading,
    categoriesError,
  } = useAppSelector((state) => state.products);

  // Fetch products on filter changes
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, page, searchTerm, categoryFilter]);

  // Fetch categories once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const totalPages = Math.ceil(total / limit);

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
  };

  return (
    <div className="flex max-w-7xl mx-auto gap-6 p-6">
      {/* Product List & Controls */}
      <div className="w-4xl">
        <div className="mb-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="border px-4 py-2 rounded w-full md:w-1/3"
          />
          <Link href="/products/create">
            <button className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap">
              + Add New Product
            </button>
          </Link>
        </div>

        {loading ? (
  <p>Loading...</p>
) : error ? (
  <p className="text-red-600">{error}</p>
) : (
  <>
    <ProductList products={products} onDelete={handleDelete} />
    <Pagination
      currentPage={page}
      totalPages={Math.ceil(total / limit)}
      onPageChange={(newPage) => dispatch(setPage(newPage))}
    />
  </>
)}
      </div>

      {/* Sidebar */}
      <aside className="w-64">
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : categoriesError ? (
          <p className="text-red-600">{categoriesError}</p>
        ) : (
         <CategoryFilterSidebar
  categories={categories}              // string[]
  selectedCategory={categoryFilter}    // string
  onSelectCategory={(cat: string) => dispatch(setCategoryFilter(cat))}  // (string) => void
/>

        )}
      </aside>
    </div>
  );
}

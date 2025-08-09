'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProducts, fetchCategories, setSearchTerm, setCategoryFilter, setPage, deleteProduct } from '@/redux/productSlice';
import ProductList from '@/components/ProductList';
import CategoryFilterSidebar from '@/components/CategoryFilterSidebar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, total, page, limit, searchTerm, categoryFilter, loading, error, categories, categoriesLoading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!categories.length && !categoriesLoading) {
      dispatch(fetchCategories());
    }
    dispatch(fetchProducts());
  }, [dispatch, page, searchTerm, categoryFilter, categories, categoriesLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
    dispatch(setPage(1)); // Reset to page 1 on search
  };

  const handleCategorySelect = (category: string) => {
    dispatch(setCategoryFilter(category));
    dispatch(setPage(1)); // Reset to page 1 on category change
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product Catalog</h1>
          <Link
            href="/products/create"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
          >
            Add New Product
          </Link>
        </div>
      </header>
      <div className="container mx-auto p-6 flex gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search products..."
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <>
              <ProductList products={products} onDelete={handleDelete} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
         <CategoryFilterSidebar
          categories={categories.map((cat) => cat.name)}
          selectedCategory={categoryFilter}
          onSelectCategory={handleCategorySelect}
    
        />
      </div>
    </div>
  );
}
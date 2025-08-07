'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProducts, setSearchTerm, setCategory, setPage } from '@/redux/productSlice';

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { products, loading, error, searchTerm, category, page, total } = useAppSelector(
    (state) => state.products
  );

  const totalPages = Math.ceil(total / 6);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, searchTerm, category, page]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top bar: Search, Category, Create Button */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="border px-4 py-2 rounded w-full md:w-auto flex-grow"
          />

          <select
            value={category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="border px-4 py-2 rounded w-full md:w-auto"
          >
            <option value="">All Categories</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="fragrances">Fragrances</option>
            <option value="skincare">Skincare</option>
            <option value="groceries">Groceries</option>
          </select>
        </div>

        <Link href="/products/create" passHref>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap">
            + Create Product
          </button>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow cursor-pointer">
                 <Link
    key={product.id}
    href={`/products/${product.id}`}
    className="block border p-4 rounded shadow hover:shadow-lg transition-shadow"
  > 
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded mb-2"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                    No Image
                  </div>
                )}
                <h2 className="font-bold text-lg">{product.title}</h2>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-green-700 font-bold">${product.price}</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => dispatch(setPage(i + 1))}
                className={`px-4 py-2 border rounded ${
                  page === i + 1 ? 'bg-black text-white' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

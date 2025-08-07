'use client';

import Link from 'next/link';
import { Product } from '@/redux/productSlice';

interface ProductListProps {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-500">
              No Image
            </div>
          )}
          <h2 className="font-bold text-lg">{product.title}</h2>
          <p className="text-sm text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <Link
            href={`/products/${product.id}`}
            className="inline-block mt-2 text-blue-600 underline"
          >
            View Details
          </Link>
          <button
            onClick={() => {
              if (confirm(`Delete product "${product.title}"?`)) {
                onDelete(product.id);
              }
            }}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
            title="Delete Product"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

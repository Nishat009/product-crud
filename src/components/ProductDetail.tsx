'use client';

import { Product } from '@/redux/productSlice';
import Link from 'next/link';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl border">
      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-96 object-cover rounded-lg shadow-md"
          loading="lazy"
        />
      ) : (
        <div className="w-full max-w-lg h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
          No Image Available
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 mt-4">{product.title}</h1>
      <p className="text-2xl text-green-600 font-semibold mb-4">${product.price}</p>
      <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
      
      <div className="mt-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
}
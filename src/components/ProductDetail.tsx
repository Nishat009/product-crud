'use client';

import { Product } from '@/redux/productSlice';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <p className="text-green-700 font-semibold text-xl mb-2">${product.price}</p>
      <p className="mb-4 text-gray-700">{product.description}</p>

      {product.images && product.images.length > 0 ? (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full max-w-md rounded shadow"
          loading="lazy"
        />
      ) : (
        <div className="w-full max-w-md h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
          No Image Available
        </div>
      )}
    </div>
  );
}

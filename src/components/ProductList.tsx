'use client';

import Link from 'next/link';
import { Product } from '@/redux/productSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProductListProps {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  const safeProducts = Array.isArray(products) ? products : [];

  const handleDelete = (id: number) => {
    onDelete(id);
    toast.success('Product deleted successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (safeProducts.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {safeProducts.map((product) => (
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
            <div className="flex gap-2 mt-2">
              <Link
                href={`/products/${product.id}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Details
              </Link>
              <Link
                href={`/products/edit/${product.id}`}
                className="text-green-600 underline hover:text-green-800"
              >
                Edit
              </Link>
            </div>
            <button
              onClick={() => handleDelete(product.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
              title="Delete Product"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
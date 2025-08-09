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
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (safeProducts.length === 0) {
    return <p className="text-center text-gray-600">No products found.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeProducts.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-md hover:shadow-xl transition bg-white relative"
          >
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md mb-4 text-gray-500">
                No Image
              </div>
            )}
            <h2 className="font-semibold text-lg text-gray-800">{product.title}</h2>
            <p className="text-sm text-green-600 font-medium">${product.price}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            <div className="flex gap-4 mt-4">
              <Link
                href={`/products/${product.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium transition"
              >
                View Details
              </Link>
              <Link
                href={`/products/edit/${product.id}`}
                className="text-green-600 hover:text-green-800 font-medium transition"
              >
                Edit
              </Link>
            </div>
            <button
              onClick={() => handleDelete(product.id)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold"
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
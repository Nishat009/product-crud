import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images?: string[];
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  searchTerm: string;
  categoryFilter: string;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 6,
  searchTerm: '',
  categoryFilter: '',
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
};

export const fetchProducts = createAsyncThunk<
  { products: Product[]; total: number },
  void,
  { state: { products: ProductState } }
>('products/fetchProducts', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const { limit, page, searchTerm, categoryFilter } = state.products;

  const skip = (page - 1) * limit;

  let url = '';
  if (categoryFilter) {
    url = `https://dummyjson.com/products/category/${encodeURIComponent(categoryFilter)}?limit=${limit}&skip=${skip}`;
  } else if (searchTerm) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  }

  try {
    const res = await axios.get(url);
    return { products: res.data.products, total: res.data.total };
  } catch (err: any) {
    console.error('Fetch products error:', err.message);
    throw new Error('Failed to fetch products');
  }
});

export const fetchCategories = createAsyncThunk<Category[]>(
  'products/fetchCategories',
  async () => {
    try {
      const res = await axios.get('https://dummyjson.com/products/categories');
      const categories = res.data.map((item: string | Category) => {
        if (typeof item === 'string') {
          return {
            slug: item,
            name: item.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            url: `https://dummyjson.com/products/category/${item}`,
          };
        }
        return item;
      });
      return categories as Category[];
    } catch (err: any) {
      console.error('Fetch categories error:', err.message);
      throw new Error('Failed to fetch categories');
    }
  }
);

export const deleteProduct = createAsyncThunk<
  number,
  number,
  { state: { products: ProductState } }
>('products/deleteProduct', async (id: number) => {
  try {
    await axios.delete(`https://dummyjson.com/products/${id}`);
    return id;
  } catch (err: any) {
    console.error('Delete product error:', err.message);
    if (err.response?.status === 404) {
      return id; // Simulate deletion
    }
    throw new Error('Failed to delete product');
  }
});

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Partial<Product>, { getState }) => {
    try {
      const res = await axios.post('https://dummyjson.com/products/add', {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category?.slug || product.category?.name,
        images: product.images || [],
      });
      return { ...res.data, id: res.data.id || Date.now() } as Product;
    } catch (err: any) {
      console.error('Add product error:', err.message);
      if (err.response?.status === 404) {
        const state = getState() as { products: ProductState };
        const newId = Math.max(...state.products.products.map((p) => p.id), 0) + 1;
        return {
          ...product,
          id: newId,
          category: product.category || {
            slug: 'unknown',
            name: 'Unknown',
            url: 'https://dummyjson.com/products/category/unknown',
          },
        } as Product;
      }
      throw new Error('Failed to add product');
    }
  }
);

export const editProduct = createAsyncThunk(
  'products/editProduct',
  async (product: Product, { getState }) => {
    console.log('Editing product:', product);
    try {
      const res = await axios.put(`https://dummyjson.com/products/${product.id}`, {
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category?.slug || product.category?.name,
        images: product.images || [],
      });
      const updatedProduct = { ...res.data, id: product.id, category: product.category } as Product;
      console.log('Edit product API success:', updatedProduct);
      return updatedProduct;
    } catch (err: any) {
      console.error('Edit product error:', err.message);
      if (err.response?.status === 404) {
        const state = getState() as { products: ProductState };
        const exists = state.products.products.find((p) => p.id === product.id);
        if (!exists) {
          console.error('Product not found for local update:', product.id);
          throw new Error('Product not found');
        }
        console.log('Edit product local success:', product);
        return product;
      }
      throw new Error('Failed to edit product');
    }
  }
);

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: number) => {
  try {
    const res = await axios.get(`https://dummyjson.com/products/${id}`);
    return res.data as Product;
  } catch (err: any) {
    console.error('Fetch product by ID error:', err.message);
    throw new Error('Failed to fetch product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.categoryFilter = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        console.log('Products fetched:', state.products.length);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message || 'Failed to fetch categories';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.total -= 1;
        console.log('Product deleted:', action.payload);
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.total += 1;
        console.log('Product added:', action.payload.id);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        console.log('Updating product:', action.payload);
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index >= 0) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
          state.total += 1;
        }
        console.log('Products updated:', state.products.length);
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const exists = state.products.find((p) => p.id === action.payload.id);
        if (!exists) {
          state.products.push(action.payload);
          state.total += 1;
        }
      });
  },
});

export const { setPage, setSearchTerm, setCategoryFilter } = productSlice.actions;
export default productSlice.reducer;
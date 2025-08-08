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
  localProducts: Product[]; // Store locally added products
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
  localProducts: [], // Initialize localProducts
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
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&skip=${skip}`;
  } else {
    url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  }

  const res = await axios.get(url);
  return { products: res.data.products, total: res.data.total };
});

export const fetchCategories = createAsyncThunk<Category[]>(
  'products/fetchCategories',
  async () => {
    const res = await axios.get('https://dummyjson.com/products/categories');
    return res.data as Category[];
  }
);

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number) => {
  await axios.delete(`https://dummyjson.com/products/${id}`);
  return id;
});

export const addProduct = createAsyncThunk('products/addProduct', async (product: Partial<Product>) => {
  const res = await axios.post('https://dummyjson.com/products/add', product);
  return res.data as Product;
});

export const editProduct = createAsyncThunk('products/editProduct', async (product: Product) => {
  const res = await axios.put(`https://dummyjson.com/products/${product.id}`, product);
  return res.data as Product;
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id: number) => {
  const res = await axios.get(`https://dummyjson.com/products/${id}`);
  return res.data as Product;
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
        // Merge API products with localProducts, avoiding duplicates
        const apiProducts = action.payload.products;
        const uniqueLocalProducts = state.localProducts.filter(
          (localProduct) => !apiProducts.some((apiProduct) => apiProduct.id === localProduct.id)
        );
        state.products = [...uniqueLocalProducts, ...apiProducts];
        state.total = action.payload.total + uniqueLocalProducts.length;
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
        state.localProducts = state.localProducts.filter((p) => p.id !== action.payload);
        state.total -= 1;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.localProducts.unshift(action.payload); // Add to localProducts
        state.products.unshift(action.payload); // Add to displayed products
        state.total += 1;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx >= 0) {
          state.products[idx] = action.payload;
        }
        const localIdx = state.localProducts.findIndex((p) => p.id === action.payload.id);
        if (localIdx >= 0) {
          state.localProducts[localIdx] = action.payload;
        }
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
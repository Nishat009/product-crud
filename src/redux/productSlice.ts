import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  category: string;
  images?: string[];
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  category: string;
  page: number;
  total: number;
  limit: number;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  searchTerm: '',
  category: '',
  page: 1,
  total: 0,
  limit: 10,
};

export const fetchProducts = createAsyncThunk<
  { products: Product[]; total: number },
  void,
  { state: { products: ProductState } }
>('products/fetchProducts', async (_, thunkAPI) => {
  const { searchTerm, category, page, limit } = thunkAPI.getState().products;
  let url = `https://dummyjson.com/products?limit=${limit}&skip=${(page - 1) * limit}`;

  if (searchTerm) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&skip=${(page - 1) * limit}`;
  } else if (category) {
    url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${(page - 1) * limit}`;
  }

  const res = await axios.get(url);
  return { products: res.data.products, total: res.data.total };
});

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (newProduct: {
    title: string;
    price: number;
    description?: string;
    category?: string;
    images?: string[];
  }) => {
    const response = await axios.post('https://dummyjson.com/products/add', newProduct, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }
);
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await res.json();
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
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
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.unshift(action.payload);
        state.total += 1;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
  const existing = state.products.find(p => p.id === action.payload.id);
  if (!existing) {
    state.products.push(action.payload);
  }
})

  },
});

export const { setSearchTerm, setCategory, setPage } = productSlice.actions;
export default productSlice.reducer;

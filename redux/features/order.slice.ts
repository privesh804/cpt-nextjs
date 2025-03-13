import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  orders: Order[];
  selectedOrder?: Order;
  loading: boolean;
} = {
  orders: [],
  selectedOrder: undefined,
  loading: false,
};

export const adminSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.loading = false;
    },
    addNewOrder: (state, action: PayloadAction<Order>) => {
      state.orders = [...state.orders, action.payload];
      state.loading = false;
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        // Create a new array with the updated admin
        state.orders = state.orders.map((admin) =>
          admin.id === action.payload.id ? action.payload : admin
        );
      }
      state.loading = false;
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((item) => item.id !== action.payload);
      state.loading = false;
    },
    setSelectedOrder: (state, action: PayloadAction<string>) => {
      state.selectedOrder = state.orders.find(
        (item) => item.id === action.payload
      );
      state.loading = false;
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addOrders,
  addNewOrder,
  updateOrder,
  removeOrder,
  setSelectedOrder,
  setOrderLoading,
} = adminSlice.actions;
export default adminSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  admins: Admin[];
  selectedAdmin?: Admin;
  loading: boolean;
} = {
  admins: [],
  selectedAdmin: undefined,
  loading: false,
};

export const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    addAdmins: (state, action: PayloadAction<Admin[]>) => {
      state.admins = action.payload;
      state.loading = false;
    },
    addNewAdmin: (state, action: PayloadAction<Admin>) => {
      state.admins = [...state.admins, action.payload];
      state.loading = false;
    },
    updateAdmin: (state, action: PayloadAction<Admin>) => {
      const index = state.admins.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        // Create a new array with the updated admin
        state.admins = state.admins.map((admin) =>
          admin.id === action.payload.id ? action.payload : admin
        );
      }
      state.loading = false;
    },
    removeAdmin: (state, action: PayloadAction<string>) => {
      state.admins = state.admins.filter((item) => item.id !== action.payload);
      state.loading = false;
    },
    setSelectedAdmin: (state, action: PayloadAction<string>) => {
      state.selectedAdmin = state.admins.find(
        (item) => item.id === action.payload
      );
      state.loading = false;
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addAdmins,
  addNewAdmin,
  updateAdmin,
  removeAdmin,
  setSelectedAdmin,
  setAdminLoading,
} = adminSlice.actions;
export default adminSlice.reducer;

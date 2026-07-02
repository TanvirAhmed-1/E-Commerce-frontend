import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string; // Product ID
  variantId: string; // Variant ID
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const calculateTotals = (items: CartItem[]) => {
  let qty = 0;
  let amt = 0;
  items.forEach((item) => {
    qty += item.quantity;
    amt += item.quantity * item.price;
  });
  return { totalQuantity: qty, totalAmount: amt };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.variantId === newItem.variantId);

      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      } else {
        const updatedQty = existingItem.quantity + (newItem.quantity || 1);
        existingItem.quantity = Math.min(updatedQty, newItem.stock);
      }

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    updateQuantity(state, action: PayloadAction<{ variantId: string; quantity: number }>) {
      const { variantId, quantity } = action.payload;
      const item = state.items.find((i) => i.variantId === variantId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    removeItem(state, action: PayloadAction<string>) {
      const variantId = action.payload;
      state.items = state.items.filter((item) => item.variantId !== variantId);
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

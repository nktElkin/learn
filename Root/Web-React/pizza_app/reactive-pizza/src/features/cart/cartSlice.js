import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart:[
        {
            pizzaId: 12,
            name: 'Mediterranean',
            quantity: 2,
            unitPrice: 16,
            totalPrice: 32,
          },
          {
            pizzaId: 6,
            name: 'Vegetale',
            quantity: 1,
            unitPrice: 13,
            totalPrice: 13,
          },
          {
            pizzaId: 11,
            name: 'Spinach and Mushroom',
            quantity: 1,
            unitPrice: 15,
            totalPrice: 15,
          },
    ],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    redicers: {
        // payload: newItem
        addItem(state, action) {
            state.cart.push(action.payload);
        },
        // payload: required id
        deleteItem(state, action) {
            state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
        },
        // payload: item id
        increaseItemQuantity(state, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload);
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice
        },
        // payload: item id
        decreaseItemQuantity(state, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload);
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice
        },

        clearItem(state) {
            state.cart = [];
        },
    },
});


export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearItem } = cartSlice.actions;
export default cartSlice.reducer;
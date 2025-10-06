import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
  loading:false,
  cartItems:[],
  subtotal:0,
  courierCharge: 0,          

  tax:0,
  shippingCharges:0,
 
  discount:0,
  total:0,
  shippingInfo:{
    address:"",
    city:"",
    state:"",
    phnumber:"",
    pinCode:"",
  }
}

export const cartReducer = createSlice({
  name:"cartReducer",
  initialState,
  reducers:{
    addToCart: (state, action:PayloadAction<CartItem>) => {
      state.loading = true;

      const index = state.cartItems.findIndex(
        (i)=>i.productId === action.payload.productId
      );
      if(index !== -1) state.cartItems[index] = action.payload;
      else state.cartItems.push(action.payload);
      state.loading = false;
    },

    removeCartItem:(state, action:PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i) => i.productId !== action.payload
      );
      state.loading = false;
    },

//     calculatePrice: (state) => {
//       const subtotal = state.cartItems.reduce(
//         (total, item) => total +  item.price * item.quantity, 0
//         );

         

//       state.subtotal = subtotal;
//       state.shippingCharges = state.subtotal > 100 ? 45 : 0;
//       state.courierCharge = state.subtotal > 100 ? 30 : 0;
//       state.tax = Math.round(state.subtotal * 0) 
      
//     //   state.total = state.subtotal + state.tax + state.shippingCharges + state.courierCharge - state.discount;
//     // },
//     state.total = Math.max(
//   state.subtotal + state.tax + state.shippingCharges + state.courierCharge - state.discount,
//   0
// )},
calculatePrice: (state) => {
  const subtotal = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  state.subtotal = subtotal;
  state.shippingCharges = state.subtotal > 100 ? 45 : 0;
  state.courierCharge = state.subtotal > 100 ? 30 : 0;
  state.tax = Math.round(state.subtotal * 0); // Adjust tax logic if needed

  state.total = Math.max(
    state.subtotal + state.tax + state.shippingCharges + state.courierCharge - state.discount,
    0
  );
},
      discountApplied:(state, action:PayloadAction<number>) => {
      state.discount = action.payload;
},
    saveShippingInfo:(state, action:PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload
    },
    resetCart: () => initialState,

  },
});

export const {
  addToCart, 
  removeCartItem, 
  calculatePrice, 
  discountApplied,
  saveShippingInfo,
  resetCart,
 } = cartReducer.actions
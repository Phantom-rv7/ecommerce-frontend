// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Product } from "../../types/types";

// interface FavoriteState {
//   items: Product[];
// }

// const initialState: FavoriteState = {
//   items: [],
// };

// const favoriteSlice = createSlice({
//   name: "favorites",
//   initialState,
//   reducers: {
//     addToFavorites: (state, action: PayloadAction<Product>) => {
//       const exists = state.items.find(p => p._id === action.payload._id);
//       if (!exists) state.items.push(action.payload);
//     },
//     removeFromFavorites: (state, action: PayloadAction<string>) => {
//       state.items = state.items.filter(p => p._id !== action.payload);
//     },
//   },
// });

// export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;
// export default favoriteSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../types/types";

interface FavoriteState {
  items: ProductType[];
}

const initialState: FavoriteState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<ProductType[]>) => {
      state.items = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<ProductType>) => {
      state.items.push(action.payload);
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setFavorites, addToFavorites, removeFromFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;

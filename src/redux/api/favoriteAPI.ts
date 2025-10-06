import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductType } from "../../types/types";

export const favoriteApi = createApi({
  reducerPath: "favoriteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/favorite`,
  }),
  tagTypes: ["Favorites"],

  endpoints: (builder) => ({
    // 🔍 Get all favorites for a user
    getFavorites: builder.query<ProductType[], string>({
      query: (userId) => `?id=${userId}`,
      providesTags: ["Favorites"],
    }),

    // ➕ Add a product to favorites
    addFavorite: builder.mutation<void, { userId: string; productId: string }>({
      query: ({ userId, productId }) => ({
        url: `?id=${userId}`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Favorites"],
    }),

    // ❌ Remove a product from favorites
    removeFavorite: builder.mutation<void, { userId: string; productId: string }>({
      query: ({ userId, productId }) => ({
        url: `/${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;

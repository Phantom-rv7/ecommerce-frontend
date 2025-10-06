import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../../types/api-types";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`, // Adjust if needed
  }),
  endpoints: (builder) => ({
    createOrder: builder.query<CreateOrderResponse, number>({
      query: (amount) => ({
        url: "create-order",
        method: "POST",
        body: { amount },
      }),
      keepUnusedDataFor: 0,
    }),

    verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentPayload>({
      query: (payload) => ({
        url: "verify",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateOrderQuery,
  useVerifyPaymentMutation,
} = paymentApi;

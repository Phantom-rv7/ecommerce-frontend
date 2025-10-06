import { Bar, CartItem, CouponType, Line, Order, Pie, Product, Review, ShippingInfo, Stats, User } from "./types";

export type CustomError = {
  status:number;
  data:{
    message:string;
    success:boolean;
  }
}

export type MessageResponse = {
  success:boolean;
  message:string;
  token: string; // ✅ Add this line
}

export type AllUsersResponse = {
  success:boolean;
  users:User[];
}

export type UserResponse = {
  success:boolean;
  user:User;
}

export type AllProductResponse = {
  success:boolean;
  products:Product[];
}

export type AllReviewsResponse = {
  success:boolean;
  reviews:Review[];
}

export type CategoriesResponse = {
  success:boolean;
  categories:string[];
}

export type SearchProductsResponse = AllProductResponse &{
  totalPage:number;
};

export type SearchProductsRequest = {
  price:number;
  page:number;
  category:string;
  search:string;
  sort:string;
  genderType?: string; // ✅ Add this if missing
};

export type ProductResponse = {
  success:boolean;
  product:Product;
}

export type AllOrdersResponse = {
  success:boolean;
  orders:Order[];
}

export type OrderDetailsResponse = {
  success:boolean;
  order:Order;
}

export type StatsResponse = {
  success:boolean;
  stats:Stats;
}

export type PieResponse = {
  success:boolean;
  charts:Pie;
}

export type BarResponse = {
  success:boolean;
  charts:Bar ;
}

export type LineResponse = {
  success:boolean;
  charts:Line ;
}

export type NewReviewRequest = {
  rating:number;
  comment:string;
  userId?:string;
  productId:string;
}

export type DeleteReviewRequest = {
  userId?:string;
  reviewId:string;
}

export type NewProductRequest = {
  id:string;
  formData:FormData;
}
// export type NewProductRequest = {
//   id:string;
//   formData:FormData;
// }

export type UpdateProductRequest = {
  productId:string;
  userId:string;
  formData:FormData;
}

// export type DeleteProductRequest = {
//   productId:string;
// }
export type DeleteProductRequest = {
  userId:string;
  productId:string;
}


// export type NewOrderRequest = {
//     shippingInfo: ShippingInfo;
//     orderItems:CartItem[];
//     subtotal: number;
//     tax: number;
//     shippingCharges: number;
//     courierCharge:number;
//     discount: number;
//     total: number;
//     user:string;
//     selectedSize:string;
//     paymentInfo: {
//     id: string;
//     status: string;
//   };
// }
// export type NewOrderRequest = {
//     shippingInfo: ShippingInfo;
//     orderItems:CartItem[];
//     subtotal: number;
//     tax: number;
//     shippingCharges: number;
//     discount: number;
//     total: number;
//     user:string;
// }
export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface NewOrderRequest {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  shippingCharges: number;
  total: number;
  user: string;
}



export type UpdateOrderRequest = {
  orderId: string;
  userId:string;
};

export type DeleteUserRequest = {
  userId:string;
  adminUserId:string;
}



export type NewUserRequestBody = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: "male" | "female" | "other";
  dob: string;
  role: "admin" | "user";
  password?: string; // Optional for Google Sign-In
};

export interface LoginRequestBody {
  _id: string;
  email: string;
}


export interface FrontendLoginRequest {
  _id: string;
  email: string;
}


export type AllDiscountResponse = {
  success:boolean;
  coupons:CouponType[];
}

export type SingleCouponResponse = {
  success:boolean;
  coupon:CouponType;
}




export interface CreateOrderResponse {
  id: string; // Razorpay order ID (e.g., "order_RJlpAYV9SrmOgN")
  entity: "order";
  amount: number; // in paise
  amount_paid: number;
  amount_due: number;
  currency: "INR";
  receipt: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
  created_at: number; // Unix timestamp
}


export interface VerifyPaymentPayload {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;

  orderItems: {
    name: string;
    price: number;
    quantity: number;
    productId: string;
  }[];

  shippingInfo: {
    address: string;
    city: string;
    state: string;
    pinCode: string;
    phnumber: string;
  };

  user: string; // user ID

  subtotal: number;
  tax: number;
  discount: number;
  shippingCharges: number;
  total: number;
}


export interface VerifyPaymentResponse {
  success: true;
  message: "Payment verified and order created";
}






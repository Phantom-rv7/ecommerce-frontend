import { CartItem, ShippingInfo, User } from "./types"


// export interface UserReducerInitialState {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   isAuthenticated: boolean;
// }
export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
  token: string | null;
  isAuthenticated: boolean;
}


export interface CartReducerInitialState{
  loading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  courierCharge:number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
}
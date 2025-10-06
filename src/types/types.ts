
export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender?: string;
  dob?: string;
  token?: string;
  role: string;
}


export type Product = {
  name:string;
  price:number;
  stock:number;
  category:string;
  photos:{
    url:string;
    public_id:string;
  }[];
  _id:string;
  materialType:string;
  ratings:number;
  numOfReviews:number;
  description:string;
  size:string;
  fakePrice:number;
  off:number;
  color:string;
  pocket:string;
  gsm:string;
  genderType:string;
  slug: string; // ✅ Add this line
}


export type ShippingInfo = {
  address:string;
  pinCode:string;
  city:string;
  state:string;
  phnumber:string;
}

export type CartItem = {
  productId:string;
  photo:string;
  name:string;
  price:number;
  quantity:number;
  stock:number;
  materialType:string;
  size:string;
  off:number;
  fakePrice:number;
  color:string;
  pocket:string;
  gsm:string;
  genderType:string;
}

// export type OrderItem = Omit<CartItem, "stock"> & {_id:string}'
export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  photo?: string;
  productId: {
    _id: string;
    name?: string;
    price?: number;
    photos?: { url: string }[];
  };
}


export interface PaymentInfo {
  id: string;
  status: string;
  method?: string; // optional, e.g. "Razorpay", "Stripe"
}

export type Order = {
  orderItems:OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  paymentInfo?: PaymentInfo;
  status:string;
  user:{
    name:string;
    _id:string;
  };
  _id:string;
};

type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type LatestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
}


export type Stats = {
  categoryCount:Record<string, number>[],
  changePercent:CountAndChange,
  count:CountAndChange,
    chart:{
      order:number[],
      revenue:number[],
    },
  userRatio:{
    male: number;
    female: number; 
  },
  latestTransaction:LatestTransaction[],
};

type OrderFullFillment = {
    processing: number;
    shipping: number;
    delivered: number;
  }

type RevenueDistribution = {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
}

type UserAgeGroup = {
    teen: number;
    adult: number;
    old: number;
  }

export type Pie = {
  orderFullfillment:OrderFullFillment
  productCategories:Record<string, number>[],
  stockAvailability:{
    inStock: number;
    outofStock: number;
    },
  revenueDistribution:RevenueDistribution;
  usersAgeGroup:UserAgeGroup;
  adminCustomer:{
    admin: number;
    customer: number;
  },
};

export type Bar = {
  users:number[];
  products:number[];
  orders:number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount:number[];
  revenue:number[];
};

export type CouponType = {
  code:string;
  amount:number;
  _id:string;
};

export type Review = {
  rating:number;
  comment:string;
  product:string;
  user:{
    name:string;
    photo:string;
    _id:string;
  };
  _id:string;
}







export interface ProductType {
  _id: string;
  name: string;
  price: number;
  photos: { url: string }[];
  // add other fields if needed
}





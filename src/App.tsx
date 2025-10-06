import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/loader";
import "../src/styles/app.scss";
import Header from "./components/header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
// import { useGetUserByIdQuery } from "./redux/api/userAPI"; // ✅ RTK Query version
import { UserReducerInitialState } from "./types/reducer-types";
import ProtectedRoute from "./components/protected-route";


// Lazy-loaded pages
const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const ProductDetails = lazy(() => import("./pages/product-details"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/order-details"));
const NotFound = lazy(() => import("./pages/not-found"));
const CheckOutForm = lazy(() => import("./pages/checkout"));
const DescribeDetails = lazy(() => import("./pages/describe_details"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Privacy = lazy(() => import("./pages/privacy"));

// Admin pages
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Discount = lazy(() => import("./pages/admin/discount"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(() => import("./pages/admin/management/productmanagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/transactionmanagement"));
const DiscountManagement = lazy(() => import("./pages/admin/management/discountmanagement"));
const NewDiscount = lazy(() => import("./pages/admin/management/newdiscount"));


const App = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const listen = () => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const res = await fetch(`${import.meta.env.VITE_SERVER}/api/v1/user/${firebaseUser.uid}`);
            const data = await res.json();
            dispatch(userExist(data.user));
          } catch (error) {
            
            dispatch(userNotExist());
          }
        } else {
          dispatch(userNotExist());
        }
      });
    };
    listen();
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/details/:category" element={<DescribeDetails />} />
    <Route path="/search" element={<Search />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/login" element={<Login />} /> {/* ✅ No ProtectedRoute */}

  {/* Authenticated Routes */}
  <Route
    element={
      <ProtectedRoute isAuthenticated={!!user} loading={loading}>
        <Outlet />
      </ProtectedRoute>
    }
  >
    <Route path="/shipping" element={<Shipping />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/order/:id" element={<OrderDetails />} />
    <Route path="/pay" element={<CheckOutForm />} />
  </Route>

  {/* Admin Routes */}
  <Route
    element={
      <ProtectedRoute
        isAuthenticated={!!user}
        loading={loading}
        adminOnly={true}
        admin={user?.role === "admin"}
      >
        <Outlet />
      </ProtectedRoute>
    }
  >
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/product" element={<Products />} />
    <Route path="/admin/customer" element={<Customers />} />
    <Route path="/admin/transaction" element={<Transaction />} />
    <Route path="/admin/discount" element={<Discount />} />
    <Route path="/admin/chart/bar" element={<Barcharts />} />
    <Route path="/admin/chart/pie" element={<Piecharts />} />
    <Route path="/admin/chart/line" element={<Linecharts />} />
    <Route path="/admin/app/coupon" element={<Coupon />} />
    <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
    <Route path="/admin/app/toss" element={<Toss />} />
    <Route path="/admin/product/new" element={<NewProduct />} />
    <Route path="/admin/product/:id" element={<ProductManagement />} />
    <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
    <Route path="/admin/discount/new" element={<NewDiscount />} />
    <Route path="/admin/discount/:id" element={<DiscountManagement />} />
  </Route>

  {/* Catch-all */}
  <Route path="*" element={<NotFound />} />
</Routes>

      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
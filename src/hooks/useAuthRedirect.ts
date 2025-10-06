// hooks/useAuthRedirect.ts
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { RootState } from "../redux/store";
import toast from "react-hot-toast";

export const useAuthRedirect = () => {
  const { user, loading } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  const isAuthenticated = Boolean(user?._id);

  // useEffect(() => {
  //   if (!loading && !isAuthenticated && !hasRedirected.current) {
  //     hasRedirected.current = true;
  //     toast.error("Please login to continue.");
  //     navigate("/login", {
  //       state: { from: location.pathname },
  //       replace: true,
  //     });
  //   }
  // }, [isAuthenticated, loading, navigate, location]);
  useEffect(() => {
  const isLoginPage = location.pathname === "/login";

  if (!loading && !isAuthenticated && !hasRedirected.current && !isLoginPage) {
    hasRedirected.current = true;
    toast.error("Please login to continue....");
    navigate("/login", {
      state: { from: location.pathname },
      replace: true,
    });
  }
}, [isAuthenticated, loading, navigate, location]);


  return isAuthenticated;
};

import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";


interface Props {
  children?: React.ReactElement;
  isAuthenticated: boolean;
  loading: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
  fallbackRedirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  loading,
  children,
  adminOnly,
  admin,
  redirect = "/login",
  fallbackRedirect = "/",
}: Props) => {
  const location = useLocation();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasShownToast.current) {
      toast.error("Please login to continue.");
      hasShownToast.current = true;
    } else if (!loading && adminOnly && !admin && !hasShownToast.current) {
      toast.error("Admin access only.");
      hasShownToast.current = true;
    }
  }, [isAuthenticated, adminOnly, admin, loading]);

  if (loading) return null; // or a spinner

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirect}
        state={{ from: location.pathname, fallbackRedirect }}
        replace
      />
    );
  }

  if (adminOnly && !admin) {
    return <Navigate to={redirect} replace />;
  }

  return children ? children : <Outlet />;
};



export default ProtectedRoute
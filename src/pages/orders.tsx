import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "../components/loader";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { RootState } from "../redux/store";
import { CustomError } from "../types/api-types";
import { BiArrowBack } from "react-icons/bi";

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, data, isError, error } = useMyOrdersQuery(user?._id!);

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
  if (!isLoading && data?.orders.length === 0) {
    toast('No orders found. Redirecting to cart...');
    navigate('/cart');
  }
}, [isLoading, data, navigate]);


  return (
    <div className="orders-container">
      <button className="home-btn" onClick={() => navigate("/")}>
        <BiArrowBack size={20} />
      </button>
      <h1>My Orders</h1>

      {isLoading ? (
        <Skeleton length={21} />
      ) : (
        <div className="order-list">
          {data?.orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">
                  <strong>Order ID:</strong> {order._id}
                </span>
                <span
                  className={`order-status ${
                    order.status === "Processing"
                      ? "red"
                      : order.status === "Shipped"
                      ? "green"
                      : order.status === "Cancelled"
                      ? "gray"
                      : "purple"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.paymentInfo?.id && (
                <div className="payment-info">
                  <span className="badge badge-success">Paid via Razorpay</span>
                  <a
                    href={`https://razorpay.com/payment/${order.paymentInfo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="receipt-link"
                  >
                    View Receipt
                  </a>
                </div>
              )}

              <div className="product-list">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="product-item">
                    <span className="product-name">{item.name}</span>
                    <span className="product-qty">Qty: {item.quantity}</span>
                    <span className="product-price">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-total">
                  <strong>Total:</strong> ₹{order.total}
                </span>
                {user?.role === "admin" ? (
                  <Link to={`/admin/transaction/${order._id}`} className="manage-link">
                    Manage
                  </Link>
                ) : (
                  <span style={{ color: "#aaa", fontSize: "0.85rem" }}></span>
                )}
              </div>
              <div className="order-help">
                <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "0.5rem" }}>
                  For any queries or order deletion requests, please{" "}
                  <a
                    href="https://wa.me/917306638887"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    contact us on WhatsApp
                  </a>{" "}
                  and include your Order ID.
                </p>
                <div className="copy-order-id">
                  <strong>Order ID:</strong>{" "}
                  <span
                    style={{
                      userSelect: "all",
                      backgroundColor: "#f5f5f5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                      cursor: "text",
                    }}
                  >
                    {order._id}
                  </span>
                </div>
              </div>

            </div>
          ))}
          
        </div>
      )}
    </div>
  );
};

export default Orders;

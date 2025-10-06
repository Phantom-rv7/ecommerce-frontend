import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import {
  useAllOrdersQuery,
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../../redux/api/orderAPI";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { OrderItem } from "../../../types/types";
import { responseToast } from "../../../utils/feautures";

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );


  const { id: orderId } = useParams();

  const {
    data: singleOrderData,
    isLoading: isSingleLoading,
    isError: isSingleError,
  } = useOrderDetailsQuery(orderId!, {
    skip: !orderId,
  });


  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useAllOrdersQuery(user?._id!, {
    refetchOnMountOrArgChange: true,
    skip: !!orderId,
  });


  useEffect(() => {
    if (!orderId) refetch();
  }, [refetch, orderId]);

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const orders = data?.orders || [];
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateHandler = async (orderId: string, userId: string) => {
    const res = await updateOrder({ orderId, userId });
    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async (orderId: string, userId: string) => {
    const res = await deleteOrder({ orderId, userId });
    responseToast(res, navigate, "/admin/transaction");
  };

  if (isError || isSingleError) return <Navigate to="/404" />;

  const renderOrder = (order: any) => (
    <section key={order._id} style={{ padding: "2rem" }}>
      <h2>Order ID: {order._id}</h2>
      <h4>User: {order.user?.name}</h4>
      <div className="shipping-info">
        <h4>Shipping Info</h4>
        <div className="shipping-field"><strong>Name:</strong> {order.user?.name}</div>
        <div className="shipping-field"><strong>Address:</strong> {order.shippingInfo?.address}</div>
        <div className="shipping-field"><strong>City:</strong> {order.shippingInfo?.city}</div>
        <div className="shipping-field"><strong>State:</strong> {order.shippingInfo?.state}</div>
        <div className="shipping-field"><strong>Pin Code:</strong> {order.shippingInfo?.pinCode}</div>
        <div className="shipping-field"><strong>Phone:</strong> {order.shippingInfo?.phnumber}</div>

        <button
          className="copy-shipping-btn"
          onClick={() => {
            const s = order.shippingInfo;
            const text = `
              Address: ${s?.address}
              City: ${s?.city}
              State: ${s?.state}
              Pin Code: ${s?.pinCode}
              Phone: ${s?.phnumber}
                  `.trim();

            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
          }}
        >
          Copy Shipping Info
        </button>

    {copied && <span className="copy-feedback">Copied</span>}


      </div>
      {order.orderItems.map((item: OrderItem) => {
        const firstPhoto = item.productId?.photos?.[0]?.url || "";
        return <ProductCard key={item._id} {...item} photo={firstPhoto} />;
      })}
      <p>
        Status:{" "}
        <span
          className={
            order.status === "Delivered"
              ? "purple"
              : order.status === "Shipped"
              ? "green"
              : "red"
          }
        >
          {order.status}
        </span>
      </p>
      <p>Total: ₹{order.total}</p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        <button
          style={{ marginRight: "4px" }}
          className="shipping-btn"
          onClick={() => updateHandler(order._id, order.user._id)}
        >
          Process Status
        </button>
        <button
          className="product-delete-btn"
          onClick={() => deleteHandler(order._id, order.user._id)}
        >
          <FaTrash />
        </button>
        {orderId && <Link to="/admin/transaction">← Back</Link>}
        {!orderId && <Link to={`/admin/transaction/${order._id}`}>Manage</Link>}
      </div>
    </section>
  );

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main className="product-management">
        {isLoading || isSingleLoading ? (
          <Skeleton />
        ) : orderId ? (
          singleOrderData?.order ? (
            renderOrder(singleOrderData.order)
          ) : (
            <p style={{ padding: "2rem" }}>No order found for ID: {orderId}</p>
          )
        ) : (
          <>
            {paginatedOrders.map((order) => renderOrder(order))}
          </>
        )}      
        </main>

      {!orderId && (
        <div className="pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem & { photo?: string }) => (
  <div className="transaction-product-card">
    <img
      src={photo || "/fallback.jpg"}
      alt={name}
      onError={(e) => {
        e.currentTarget.src = "/fallback.jpg";
      }}
    />
    <Link to={`/product/${productId._id}`}>{name}</Link>
    <span>
      ₹{price} × {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;



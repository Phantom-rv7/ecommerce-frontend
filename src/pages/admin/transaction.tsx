import { ReactElement, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";

interface DataType {
  transactionId: string;
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Transaction ID", accessor: "transactionId" },
  { Header: "Avatar", accessor: "user" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Quantity", accessor: "quantity" },
  { Header: "Status", accessor: "status" },
  { Header: "Action", accessor: "action" },
];

const Transaction = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();

  const { isLoading, data, isError, error, refetch } = useAllOrdersQuery(user?._id!, {
    refetchOnMountOrArgChange: true,
  });

  const [rows, setRows] = useState<DataType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      const mappedRows = data.orders.map((i) => ({
        transactionId: i._id,
        user: i.user?.name || "Unknown",
        amount: i.total,
        discount: i.discount,
        quantity: i.orderItems?.length || 0,
        status: (
          <span
            className={
              i.status === "Processing"
                ? "red"
                : i.status === "Shipped"
                ? "green"
                : "purple"
            }
          >
            {i.status}
          </span>
        ),
        action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
      }));
      setRows(mappedRows);
    }
  }, [data]);

  const filteredRows = useMemo(() => {
  const trimmedSearch = searchTerm.trim().toLowerCase();
  return rows.filter((row) =>
    typeof row.transactionId === "string" &&
    row.transactionId.toLowerCase().includes(trimmedSearch)
  );
}, [searchTerm, rows]);


  // ✅ Auto-navigate to order if exact match is found
  useEffect(() => {
  const trimmedSearch = searchTerm.trim().toLowerCase();
  const exactMatch = rows.find(
    (row) =>
      typeof row.transactionId === "string" &&
      row.transactionId.toLowerCase() === trimmedSearch
  );
  if (exactMatch) {
    navigate(`/admin/transaction/${exactMatch.transactionId}`);
  }
}, [searchTerm, rows, navigate]);


  const TableComponent = useMemo(() => {
    return TableHOC<DataType>(
      columns,
      filteredRows,
      "dashboard-product-box",
      "Transactions",
      filteredRows.length > 10
    );
  }, [filteredRows]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {isLoading ? (
          <Skeleton length={21} />
        ) : (
          <>
            <div className="bar">
              <input
                type="text"
                placeholder="Search by Transaction ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <TableComponent />
          </>
        )}
      </main>
    </div>
  );
};

export default Transaction;





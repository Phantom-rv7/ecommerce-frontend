import { useFetchData } from "6pp";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { server } from "../../../redux/store";
import { SingleCouponResponse } from "../../../types/api-types";
import { UserReducerInitialState } from "../../../types/reducer-types";


const DiscountManagement = () =>{

    const {user} = useSelector(
        (state:{userReducer:UserReducerInitialState}) => state.userReducer);

    const {id} = useParams();
    const navigate = useNavigate();

    const {
      loading: isLoading,
      data,
      error,
    } = useFetchData<SingleCouponResponse>({
      url: `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
      key: "single-discount-code",
      dependencyProps: [id ?? "", user?._id ?? ""],
    });

    if(error){
      toast.error(error);
    }
    
    const [btnLoading, setbtnLoading] = useState<boolean>(false);

    const [code, setCode] = useState("");
    const [amount,setAmount] = useState(0);

    const submitHandler = async (e:FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setbtnLoading(true);

        try{
            const { data } = await axios.put(
              `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
              { code, amount },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            if(data.success){
                setAmount(0);
                setCode("");
                toast.success(data.message);
                navigate("/admin/discount");
            }
        }
        catch(error){

        }
        finally{
            setbtnLoading(false);
        }
    }

    useEffect(() => {
        if(data){
            setCode(data.coupon.code);
            setAmount(data.coupon.amount)
        }
    }, [data])

    const deleteHandler = async () => {

        setbtnLoading(true);

        try{
            const { data } = await axios.delete(
              `${server}/api/v1/payment/coupon/${id}?id=${user?._id}`,
              {
                withCredentials: true,
              }
            );
            if(data.success){
                toast.success(data.message);
                
            }
        }
        catch(error){

        }
        finally{
            setbtnLoading(false);
        }
    }

return (

    <div className="admin-container">
          <AdminSidebar />
          <main className="product-management">
            {isLoading ? (
              <Skeleton length={20} />
            ) : (
              <>
                <article>
                        <button className="product-delete-btn" onClick={deleteHandler}>
                        <FaTrash />
                        </button>
        
                        <form onSubmit={submitHandler}>
                        <h2>Manage</h2>
        
                        <div>
                            <label>Name</label>
                            <input
                            type="text"
                            placeholder="Coupon Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Price</label>
                            <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
        
        
                        <button disabled={btnLoading} type="submit">
                            Update
                        </button>
                        </form>
                    </article>
              </>
            )}
          </main>
        </div>
)
}

export default DiscountManagement;
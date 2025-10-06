import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { server } from "../../../redux/store";
import { UserReducerInitialState } from "../../../types/reducer-types";


const NewDiscount = () =>{

    const {user} = useSelector(
        (state:{userReducer:UserReducerInitialState}) => state.userReducer);

    const navigate = useNavigate();
    
    const [btnLoading, setbtnLoading] = useState<boolean>(false);

    const [code, setCode] = useState("");
    const [amount,setAmount] = useState(0);

    const submitHandler = async (e:FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setbtnLoading(true);

        try{
            const { data } = await axios.post(
              `${server}/api/v1/payment/coupon/new?id=${user?._id}`,
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

return (

    <div className="admin-container">
          <AdminSidebar />
          <main className="product-management">
                <article>
        
                        <form onSubmit={submitHandler}>
                        <h2>Create Coupon</h2>
        
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
                            Create
                        </button>
                        </form>
                    </article>
          </main>
        </div>
)
}

export default NewDiscount ;
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../redux/store";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    phnumber: "",
    pinCode: "",
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { address, city, state, phnumber, pinCode } = shippingInfo;

    if (!address || !city || !state) {
      alert("Please fill out all address fields.");
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      alert("Pin code must be exactly 6 digits.");
      return;
    }

    if (!/^\d{10}$/.test(phnumber)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to proceed with payment.");
      return;
    }

    dispatch(saveShippingInfo(shippingInfo));
    setLoading(true);


try {
  const { data } = await axios.post(
    `${server}/api/v1/payment/create-order`, // Razorpay endpoint
    { amount: Number(total) },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  navigate("/pay", {
    state: {
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
    },
  });
} 
    catch (error: any) {
      alert(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    if (cartItems.length <= 0) navigate("/cart");
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>

        <input required type="text" placeholder="Address" name="address" value={shippingInfo.address} onChange={changeHandler} />
        <input required type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={changeHandler} />
        <input required type="text" placeholder="State" name="state" value={shippingInfo.state} onChange={changeHandler} />
        <input required type="text" inputMode="numeric" maxLength={10} placeholder="Phone Number" name="phnumber" value={shippingInfo.phnumber} onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value) && value.length <= 10) changeHandler(e);
        }} />
        <input required type="text" inputMode="numeric" maxLength={6} placeholder="Pin Code" name="pinCode" value={shippingInfo.pinCode} onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value) && value.length <= 6) changeHandler(e);
        }} />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Shipping;
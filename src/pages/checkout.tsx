import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useVerifyPaymentMutation } from '../redux/api/paymentApi';
import { useMyOrdersQuery, orderApi } from '../redux/api/orderAPI';
import { resetCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import {
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from '../types/api-types';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [verifyPayment] = useVerifyPaymentMutation();

  const {
    userReducer: { user },
    cartReducer: {
      cartItems,
      shippingInfo,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
    },
  } = useSelector((state: RootState) => state);

  const { refetch } = useMyOrdersQuery(user?._id ?? "");

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  //REDIRECT BACK TO CART
  useEffect(() => {
    if (cartItems.length === 0 || !shippingInfo.address) {
      navigate('/cart');
    }
  }, []);



  const sanitize = (str: string = '') =>
    str.replace(/[^\w\s@.]/gi, '').trim();

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0 || !shippingInfo.address) {
      toast.error('Missing checkout information');
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ amount: total }),
        }
      );

      const orderData: CreateOrderResponse = await response.json();

      // const options = {
      //   key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_default',
      //   amount: orderData.amount,
      //   currency: orderData.currency,
      //   name: 'Retro Revival',
      //   description: 'Order Payment',
      //   order_id: orderData.id,
      //   handler: async (response: {
      //     razorpay_payment_id: string;
      //     razorpay_order_id: string;
      //     razorpay_signature: string;
      //   }) => {
      //     try {
      //       const payload: VerifyPaymentPayload = {
      //         razorpayPaymentId: response.razorpay_payment_id,
      //         razorpayOrderId: response.razorpay_order_id,
      //         razorpaySignature: response.razorpay_signature,
      //         orderItems: cartItems.map((item) => ({
      //           name: item.name,
      //           price: item.price,
      //           quantity: item.quantity,
      //           productId: item.productId,
      //         })),
      //         shippingInfo: {
      //           address: shippingInfo.address,
      //           city: shippingInfo.city,
      //           state: shippingInfo.state,
      //           pinCode: shippingInfo.pinCode,
      //           phnumber: shippingInfo.phnumber,
      //         },
      //         user: user._id,
      //         subtotal,
      //         tax,
      //         discount,
      //         shippingCharges,
      //         total,
      //       };

      //       const result: VerifyPaymentResponse = await verifyPayment(payload).unwrap();

      //       toast.success(result.message);
      //       dispatch(resetCart());

      //       // ✅ Refresh user's orders immediately
      //       refetch();

      //       // ✅ Optional: global refresh across components
      //       dispatch(orderApi.util.invalidateTags(["orders"]));

      //       navigate('/orders');
      //     } catch (err: any) {
      //       toast.error(err?.data?.message || 'Payment verification failed');
      //     } finally {
      //       setIsProcessing(false);
      //     }
      //   },
      //   prefill: {
      //     name: sanitize(user.name),
      //     email: sanitize(user.email),
      //     contact:
      //       /^\d{10}$/.test(shippingInfo.phnumber) &&
      //       shippingInfo.phnumber,
      //   },
      //   theme: {
      //     color: '#3399cc',
      //   },
      //   modal: {
      //     ondismiss: () => {
      //       toast('Payment cancelled');
      //       setIsProcessing(false);
      //     },
      //   },
      // };

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_default',
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Retro Revival',
      description: 'Order Payment',
      order_id: orderData.id,
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
  }) => {
    const payload: VerifyPaymentPayload = {
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature,
      orderItems: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productId: item.productId,
      })),
      shippingInfo: {
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        pinCode: shippingInfo.pinCode,
        phnumber: shippingInfo.phnumber,
      },
      user: user._id,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
    };

    try {
      const result: VerifyPaymentResponse = await verifyPayment(payload).unwrap();
      toast.success(result.message);
      dispatch(resetCart());
      refetch();
      dispatch(orderApi.util.invalidateTags(["orders"]));
      navigate('/orders');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  },
  prefill: {
    name: sanitize(user.name),
    email: sanitize(user.email),
    contact: /^\d{10}$/.test(shippingInfo.phnumber) ? shippingInfo.phnumber : '',
  },
  theme: {
    color: '#3399cc',
  },
  modal: {
    ondismiss: () => {
      toast('Payment cancelled');
      setIsProcessing(false);
    },
  },
};

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create Razorpay order');
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Complete Your Payment</h2>

      <div className="order-summary">
        {cartItems.map((item, idx) => (
          <div key={idx} className="order-item">
            <img src={item.photo} alt={item.name} className="order-item__image" />
            <div className="order-item__details">
              <h4 style={{ fontFamily: 'monospace' }}>{item.name}</h4>
              <p style={{ fontFamily: 'monospace' }}>
                <strong>Size: </strong>{item.size}
              </p>
              <p style={{ fontFamily: 'monospace' }}>
                <strong>Quantity: </strong>{item.quantity}
              </p>
              <p style={{ fontFamily: 'monospace' }}>
                <strong>Delivery: </strong>8–10 days from Order Placed
              </p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleCheckout} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : `Pay ₹${total}`}
      </button>
    </div>
  );
};

export default CheckOut;

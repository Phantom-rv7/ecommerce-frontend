import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem as CartItem1 } from "../types/types";
import { transformImage } from "../utils/feautures";

type CartItemProps = {
  cartItem:CartItem1;
  incrementHandler: (cartItem:CartItem1) => void;
  decrementHandler: (cartItem:CartItem1) => void;
  removerHandler: (id:string) => void;
}

const CartItem = ({ 
  cartItem, 
  incrementHandler,
  decrementHandler, 
  removerHandler
 } : CartItemProps) => {

  const {photo, productId, name, price, quantity, materialType,size, fakePrice,off , color, gsm, pocket} = cartItem;
  

  return (
    <div className="cart-item">
      <img src={transformImage(photo)} alt={name} />
      <article>
        <Link style={{whiteSpace:"nowrap"}} to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
        <span>{materialType}</span>
        <span>Size:{size}</span>
      </article>
      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={() => removerHandler(productId)}>
        <FaTrash/>
      </button>
    </div>
  )
}

export default CartItem

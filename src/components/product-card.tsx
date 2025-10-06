import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { CartItem } from "../types/types";
import { transformImage } from "../utils/feautures";

type ProductProps = {
  productId:string,
  photos:{
    url:string;
    public_id:string;
  }[],
  name:string,
  price:number,
  stock:number,
  materialType:string,
  size:string,
  fakePrice:number,
  off:number;
  color:string;
  pocket:string;
  gsm:string;
  genderType:string;
  handler:(cartItem: CartItem) => string | undefined;
}                                                         

const ProductCard = (
  {productId,
  photos,
  name,
  materialType,
  price,
  stock,
  size,
  fakePrice,
  off,
  color,
  pocket,
  genderType,
  gsm,
  handler,
}:ProductProps) => {
 
  return (
    <div className="product-card">
      <img src={transformImage(photos?.[0]?.url,700)} alt={name}/>
      <p>{name}</p>
      <span>₹{price}</span>

      <div>
        <button onClick={() => 
          handler({ 
            productId, 
            photo:photos[0].url, 
            name, 
            price, 
            stock, 
            materialType, 
            size,
            fakePrice,
            off,
            gsm,
            color,
            pocket,
            genderType,
            quantity:1 })
        }>
          <FaPlus/>
        </button>
        <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
      </div>
    </div>
  )
}

export default ProductCard

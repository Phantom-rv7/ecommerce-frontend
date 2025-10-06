import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaArrowRight, FaRegStar, FaStar } from "react-icons/fa";
import { FiEdit } from 'react-icons/fi';
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import Accordion from "../components/Accordion";
import { Skeleton } from "../components/loader";
import RatingsComponent from "../components/ratings";
import { useAllReviewsOfProductsQuery, useDeleteReviewMutation, useNewReviewMutation, useProductDetailsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem, Review } from "../types/types";
import { RootState } from "../redux/store";
import { responseToast } from "../utils/feautures";
import { FaTrash } from 'react-icons/fa';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useGetFavoritesQuery,useAddFavoriteMutation, useRemoveFavoriteMutation } from "../redux/api/favoriteAPI";
import {
  addToFavorites,
  removeFromFavorites,
} from "../redux/reducer/favoriteReducer";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";


const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user} = useSelector((state:RootState) => state.userReducer);

  const {isLoading,  isError, data } = useProductDetailsQuery(id!);

  const reviewsResponse = useAllReviewsOfProductsQuery(id!);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const reviewDialogRef = useRef<HTMLDialogElement>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const reviews = reviewsResponse.data?.reviews || [];
  const numberOfReviews = reviews.length;

  const [isFavorite, setIsFavorite] = useState(false);

  const { data: favoriteList } = useGetFavoritesQuery(user?._id!, {
  skip: !user?._id,
  });

  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

    useEffect(() => {
      if (!Array.isArray(favoriteList)) return;
      if (!data || !data.product || typeof data.product._id !== "string") return;

      const isFav = favoriteList.some((p) => p?._id === data.product._id);
      setIsFavorite(isFav);
    }, [favoriteList, data]);

// Toggle favorite
const toggleFavorite = async () => {
  if (!data?.product) return toast.error("Product not found");

  if (!user?._id) {
    toast.error("Login to use this feature");
    navigate("/login", {
      state: { from: location.pathname },
      replace: true,
    });
    return;
  }

  try {
    if (!isFavorite) {
      await addFavorite({ userId: user._id, productId: data.product._id });
      dispatch(addToFavorites(data.product));
      toast.success("Added to Favorites");
    } else {
      await removeFavorite({ userId: user._id, productId: data.product._id });
      dispatch(removeFromFavorites(data.product._id));
      toast("Removed from Favorites");
    }

    setIsFavorite((prev) => !prev);
  } catch (error) {
    toast.error("Failed to update favorites");
  }
};



  const averageRating = numberOfReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / numberOfReviews
    : 0;

  const [createReview] = useNewReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const formatColor = (color: string) =>
  color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();


  const increment = () => {
    if (data?.product.stock === quantity) return toast.error("Out of Stock");
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock!");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  if (isError) return <Navigate to="/404" />;

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  }

  const {
    Ratings:RatingsEditable, 
    rating, setRating
  } = useRating({
        IconFilled:<FaStar /> ,
        IconOutline:<FaRegStar /> ,
        value:0, 
        selectable:true,
        styles:{
          fontSize:"1.75rem",
          color:"coral",
          justifyContent:"flex-start",
          gap:"1px",
      },
  });

  const reviewCloseHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  }

  const submitReview = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reviewCloseHandler();

  const res = await createReview({
      comment:reviewComment,
      rating,
      userId:user?._id,
      productId:id!,
    });
    setReviewSubmitLoading(false)

    responseToast(res, null, "");
    
    //API call to submit review
  
  };

  const handleDeleteReview = async (reviewId:string) => {
    const res = await deleteReview({reviewId, userId:user?._id});
    responseToast(res, null, "");
  }

  return (
    <div className="product-details">{/* Back to Home Button */}
      <button className="home-btn" onClick={() => navigate("/")}>
        <BiArrowBack size={20} />
      </button>
      {isLoading ? (
        <ProductLoader />
      ) : (
        <> 
        <h1 className="product_heading" style={{fontWeight:"normal",fontFamily:"monospace",margin:"0rem"}}>{data?.product.name}</h1>
            
              <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
            <button onClick={toggleFavorite} className="favorite-btn">
              {isFavorite ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
            </button>
          </div>

          <main>
           
          <section className="setsize">
            <Slider
              showThumbnails
              showNav={false}
              onClick={() => setCarouselOpen(true)}
              images={data?.product.photos.map((i) => i.url) || []}
            />
            {carouselOpen && (
              <MyntraCarousel 
                NextButton={NextButton}
                PrevButton={PrevButton}
                setIsOpen={setCarouselOpen}
                images={data?.product.photos.map((i) => i.url) || []}
              />
            )}
          </section>

          <section>
            {/* <h1 style={{fontWeight:"normal"}}>{data?.product.name}</h1> */}
            <div style={{ display: "flex", gap: "1rem", marginTop:"-0.25rem" }}>
              <h3 style={{ whiteSpace: "nowrap", color:"green" }}>{data?.product.off}%off</h3>
              <h3 style={{ whiteSpace: "nowrap", textDecoration:"line-through", color:"black", opacity:0.6,fontWeight:"lighter" }}>₹{data?.product.fakePrice}</h3>
              <h3 style={{ whiteSpace: "nowrap" }}>₹{data?.product.price}</h3>
            </div>

            <div className="size-selector">
              <h2 className="size-selector__title">Select Size</h2>
              <div className="size-selector__options">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={`size-selector__option ${
                selectedSize === size ? "selected" : ""
                  }`}
                onClick={() => setSelectedSize(size)}
                  >
                {size}
              </button>
            ))}
            </div>
              <p className="size-selector__note">
                Selected Size: <strong style={{fontWeight:"bold"}}>{selectedSize}</strong>
              </p>
          </div>

          <div className="delivery_details" style={{fontWeight:"normal", marginTop:"-1.5rem"}}>
            <h4>🚚 Delivery by 7-10 days</h4>
            <h4>🔄 3-Day Return Policy</h4>
            <h4>❌ Cancel Within 48 Hours</h4>
          </div>

            <article>
              <div>
                <button onClick={decrement}>−</button>
                <span>{quantity}</span>
                <button onClick={increment}>+</button>
              </div>

              <button
                onClick={() =>
                  addToCartHandler({
                    productId: data?.product._id!,
                    name: data?.product.name!,
                    price: data?.product.price!,
                    stock: data?.product.stock!,
                    materialType: data?.product.materialType!,
                    size: selectedSize,
                    quantity,
                    fakePrice:data?.product.fakePrice!,
                    off:data?.product.off!,
                    photo: data?.product.photos[0]?.url || "",
                    color:data?.product.color!,
                    pocket:data?.product.pocket!,
                    gsm:data?.product.gsm!,
                    genderType:data?.product.genderType!,
                  })
                }
              >
                Add To Cart
              </button>
            </article>

            <div style={{ marginTop: "0rem" }}>
              <p style={{ fontWeight: "normal" }}>
                
                🔗<span
                  style={{
                    backgroundColor: "#f4f4f4",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "5px",
                    fontFamily: "monospace",
                    cursor: "pointer",
                    color: "#007bff",
                    textDecoration: "underline"
                  }}
                  onClick={() => {
                    const productUrl = `${window.location.origin}/product/${data?.product.slug}`;
                    const shareText = `Check out this product on RetroRevival!`;

                    if (navigator.share) {
                      navigator
                        .share({
                          title: "RetroRevival Product",
                          text: shareText,
                          url: productUrl
                        })
                        .then(() => toast.success("Shared successfully!"))
                        .catch(() => toast.error("Sharing failed"));
                    } else {
                      // Fallback: open a modal or dropdown with app-specific links
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + productUrl)}`, "_blank");
                      // WhatsApp
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + productUrl)}`, "_blank");
                      // Facebook
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, "_blank");
                      // Twitter
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
                      // Instagram note: no direct link sharing supported
                      toast("Instagram doesn't support direct link sharing. You can copy the link manually.");
                      navigator.clipboard.writeText(productUrl);
                      toast("Snapchat doesn't support direct link sharing. Link copied to clipboard.");
                      navigator.clipboard.writeText(productUrl);

                    }
                  }}
                >
                  <strong>Share this product:</strong>{" "}
                </span>
              </p>
            </div>
                
            <div className="product-info-accordion">
              <Accordion title="Product Details"> 
                <p style={{fontWeight:"normal"}}><strong >Color: </strong><strong>{data?.product.color ? formatColor(data.product.color) : ''}</strong></p>
                <p style={{fontWeight:"normal"}}><strong>Fabric: </strong>{data?.product.materialType ? formatColor(data.product.materialType) : ''}</p>
                {/* <p style={{fontWeight:"normal"}}><strong>GSM: </strong>{data?.product.gsm ? formatColor(data.product.gsm) : ''}gsm</p> */}
                <p style={{fontWeight:"normal"}}><strong>Pocket: </strong>{data?.product.pocket ? formatColor(data.product.pocket) : ''}</p>
                <p style={{fontWeight:"normal"}}><strong>Wash: </strong>Machine Wash</p>
                <p style={{fontWeight:"normal"}}><strong>Airtex Fabric: </strong>Ultra-breathable, quick-drying, and lightweight.</p>
                {data?.product.description || "Crafted with care. 100% cotton, retro fit, breathable fabric."}
                 
                </Accordion> 
              <Accordion title="Vendor Details"> 
                Sold by <strong>RetroRevival</strong>. We specialize in nostalgic designs and premium cotton tees. 
              <br />
              🧵 <strong>Fabric Quality:</strong> All products are crafted from 100% breathable cotton, pre-shrunk for lasting comfort.
              <br />
                🎨 <strong>Design Philosophy:</strong> Inspired by retro pop culture, vintage typography, and timeless streetwear aesthetics.
              <br />
                🏷️ <strong>Brand Promise:</strong> Every tee is printed with fade-resistant inks and stitched for durability.
              </Accordion> 
              <Accordion title="Return & Exchange Policy">
                We offer a hassle-free <strong>3-day exchange window</strong> from the date your order was placed—no questions asked. We want you to love your tee!
                <br />
                🔁 <strong>Note:</strong> We currently support <em>exchanges only</em>. Refunds and returns are not available at this time. <br />
                📦 <strong>Exchange Process:</strong> Your exchange will be initiated <em>only after</em> we receive the original product and verify its condition. Once approved, the new item will be dispatched and delivered within <strong>8–10 days</strong>, similar to your first order. <br />
                ⚠️ <strong>Important:</strong> If the returned product does not match the item originally sent (wrong design, used item, or tampered packaging), the exchange request will be <strong>cancelled</strong>. <br />
                📲 <strong>Need help?</strong> For any exchange-related queries, feel free to connect with us via <a href="https://wa.me/917306638887" target="_blank" ><strong style={{ color: "green" }}>WhatsApp</strong></a>.
            </Accordion>

              </div>

              {/* <em style={{display:"flex", gap:"1rem", alignItems:"center",marginTop:"1.5rem"}}>
                <RatingsComponent value={averageRating} />
                ({numberOfReviews} reviews)
              </em> */}
              <em style={{display:"flex", gap:"1rem", alignItems:"center",marginTop:"1rem"}}>
                <RatingsComponent value={averageRating} />
          ({numberOfReviews} reviews)
              </em>
            
          </section>
        </main>
        </>
      )}

      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={reviewCloseHandler}>X</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview} >
          <textarea 
            value={reviewComment} 
            onChange={e => setReviewComment(e.target.value)} 
            placeholder="Review..."
            ></textarea>
          <RatingsEditable />
          <button disabled={reviewSubmitLoading} type="submit">Submit</button>
        </form>
      </dialog>

      <section>
        <article>
          <h2>
            Reviews
          </h2>
          {reviewsResponse.isLoading ? null : (
            <button onClick={showDialog}>
            <FiEdit />
            </button>
          )}
        </article>

        {/* <div style={{
          display:"flex",
          gap:"2rem",
          overflowX:"auto",
          padding:"2rem",
        }}>
          {
          reviewsResponse.isLoading ? (
            <>
              <Skeleton width="40rem" length={5} />
              <Skeleton width="40rem" length={5} />
              <Skeleton width="40rem" length={5} />
            </>
          ) : (
            reviewsResponse.data?.reviews.map((review) => (
              <ReviewCard 
              handleDeleteReview={handleDeleteReview}
              userId={user?._id!} 
              key={review._id} 
              review={review} 
              />
            ))
          )}
        </div> */}
        <div className="reviews-container">
  {reviewsResponse.isLoading ? (
    <>
      <Skeleton width="100%" length={3} />
    </>
  ) : (
    reviewsResponse.data?.reviews.map((review) => (
      <ReviewCard
        key={review._id}
        review={review}
        userId={user?._id!}
        handleDeleteReview={handleDeleteReview}
      />
    ))
  )}
</div>

      </section>
 
    </div>
  );
};

const ReviewCard = ({
  review,
  userId,
  handleDeleteReview,
  } : {
    userId?:string; 
    review: Review;
    handleDeleteReview:(reviewId:string) => void;
  }) => (
    <div key={review._id} className="review" >
        <RatingsComponent value={review.rating} />
        <p>{review.comment}</p>
        <div>
          <img src={review.user.photo} alt="User" />
          <small>{review.user.name}</small>
        </div>
         {
          userId === review.user._id && (
            <button onClick={() => handleDeleteReview(review._id)}>
          <FaTrash />
        </button>
          )
         }
      </div>
);

const ProductLoader = () => (
  <div
    style={{
      display: "flex",
      gap: "1rem",
      border: "1px solid #f1f1f1",
      height: "80vh",
    }}
  >
    <section style={{ width: "100%", height: "100%" }}>
      <Skeleton width="100%" length={1} />
    </section>
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "4rem",
        padding: "2rem",
      }}
    >
      <Skeleton width="100%" length={2} />
      <Skeleton width="100%" length={2} />
      <Skeleton width="100%" length={4} />
      <Skeleton width="100%" length={4} />
    </section>
  </div>
);

const NextButton: CarouselButtonType = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: "rgba(0,0,0,0.5)",
      color: "white",
      borderRadius: "10px",
      padding: "0.5rem",
      border: "none",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
    }}
  >
    <FaArrowRight />
  </button>
);

const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: "rgba(0,0,0,0.5)",
      color: "white",
      borderRadius: "10px",
      padding: "0.5rem",
      border: "none",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
    }}
  >
    <FaArrowLeft />
  </button>
);

export default ProductDetails;

import { Link, useNavigate } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import { Skeleton } from "../components/loader"
import toast from "react-hot-toast"
import { CartItem } from "../types/types"
import { useDispatch } from "react-redux"
import { addToCart } from "../redux/reducer/cartReducer"
import { useRef } from "react"
import CustomDesignCTA from "../components/CustomDesignCTA";
import { useEffect, useState } from "react"


const bannerImages = [
  "bg1.png",
  "BG11.jpg",
  "bg10.jpg",
]

const Home = () => {

  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate();
  const { data, isLoading } = useLatestProductsQuery("");
  const dispatch = useDispatch()

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category") || "";
  const sortFromURL = queryParams.get("sort") || "";

  const handleCollectionClick = (gender: string) => {
  const defaultSort = "asc"; // or "dsc" if you prefer high-to-low
  navigate(`/search?genderType=${gender}&sort=${defaultSort}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % bannerImages.length)
    }, 5000);
    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
  setCategory(categoryFromURL);
  setSort(sortFromURL);
}, [categoryFromURL, sortFromURL]);



  const addToCardHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock!")
    dispatch(addToCart(cartItem))
    toast.success("Added to Cart");
  }

  return (
    <div className="home">
      {isLoading ? (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh", // adjust based on your hero section height
      width: "100%",
    }}
  >
    <Skeleton width="100%" length={7} />
  </div>
) : (
  <div className="hero-text">
    <h1>Wear Your Style</h1>
    <p>Style Inspiration for Every Season</p>
  </div>
)}
              {isLoading ? (
          <Skeleton width="100vw" length={6} />
        ) : (
          <div
            className="hero-banner"
            style={{
              backgroundImage: `url(${bannerImages[currentImageIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "background-image 1s ease-in-out",
            }}
          >
            {/* Optional: Add overlay content here */}
          </div>
)}

      <section className="home-container"></section>

      <h1>
        Latest Products
        <Link to={"/search?sort=dsc"} className="findmore">
          More
        </Link>
      </h1>


      {/* <div className="product-scroll-wrapper">
        <button className="scroll-arrow left" onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}>
            &#8592;
        </button>
      <main className="product-scroll">
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              materialType={i.materialType}
              size={i.size}
              handler={addToCardHandler}
              photos={i.photos}
            />
          ))
        )}
      </main>
       <button className="scroll-arrow right" onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}>
    &#8594;
  </button>
  </div> */}

  <div className="product-scroll-wrapper">
    <button
      className="scroll-arrow left"
      onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
    >
      &#8592;
    </button>

    <main className="product-scroll" ref={scrollRef}>
      {isLoading ? (
        <Skeleton width="80vw" />
      ) : (
        data?.products.map((i) => (
          <ProductCard
            key={i._id}
            productId={i._id}
            name={i.name}
            price={i.price}
            fakePrice={i.fakePrice}
            off={i.off}
            stock={i.stock}
            materialType={i.materialType}
            size={i.size}
            handler={addToCardHandler}
            photos={i.photos}
            color={i.color}
            pocket={i.pocket}
            gsm={i.gsm}
            genderType={i.genderType}
          />
        ))
      )}
    </main>

    <button
      className="scroll-arrow right"
      onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
    >
      &#8594;
    </button>
  </div>


  <section className="collection-slider">
  <h2 className="collection-title">Our Collections</h2>
  <p className="collection-subtitle">Curated styles for every vintage enthusiast.</p>

  <div className="collection-scroll-wrapper">
    <div className="collection-scroll" id="collectionScroll" style={{objectFit:"contain"}}>
      {[
  {
    title: "T-shirt",
    desc: "Effortless Street Style.",
    img: "oversized1.jpg",
    category: "oversized",
    variants: ["half sleeve", "full sleeve"]
  },
  {
    title: "Shirt",
    desc: "Tailored for Comfort.",
    img: "shirt1.jpg",
    category: "shirt"
  },
  {
    title: "Polo",
    desc: "Relaxed fit. Refined edge.",
    img: "polonew.jpg",
    category: "polo"
  },
  {
    title: "Hoodie",
    desc: "Cozy. Cool. Classic.",
    img: "hoodie.jpg",
    category: "hoodie"
  },
  {
    "title": "Jersey",
    "desc": "Sporty. Sleek. Statement.",
    "img": "jersey.jpg",
    "category": "jersey"
  },
  {
    title: "Cap",
    desc: "Top it off in style.",
    img: "caps.jpg",
    category: "cap"
  }
].map((item, idx) => (
        <div className="collection-card" key={idx}>
          <img src={item.img} alt={item.title} />
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
          <Link
            to={`/search?category=${encodeURIComponent(item.category)}`}
            className="explore-btn" >
              Explore Collection
          </Link>
    </div>
      ))}
    </div>
  </div>

  <section className="latest-collections">
        <h2>Style Edit: Men & Women</h2>
        <div className="collection-grid">
          <div className="collection-card male" onClick={() => handleCollectionClick("male")}>
            <img src="men.jpg" alt="Men's Collection" />
            <div className="collection-info">
              <h3>Men’s Collection</h3>
              <p>Explore the latest styles for <strong style={{fontFamily:"monospace"}}>Men</strong></p>
              <button className="view-btn">View Collection</button>
            </div>
          </div>

          <div className="collection-card female" onClick={() => handleCollectionClick("female")}>
            <img src="women.jpg" alt="Women’s Collection" />
            <div className="collection-info">
              <h3>Women’s Collection</h3>
              <p>Discover new arrivals for <strong style={{fontFamily:"monospace"}}>Women</strong></p>
              <button className="view-btn">View Collection</button>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-highlight">
        <div className="premium-section">
          <img src="RR.jpg" alt="Premium Picks" className="premium-image" />

          <div className="premium-overlay">
            <h2 className="premium-title">Premium Picks</h2>
            <p className="premium-subtitle">
              Explore Premium T-shirts, Shirts, Hoodies & Caps that blend precision tailoring with effortless style.
            </p>
            <Link to="/search?price=1999&sort=dsc" className="explore-btn">
              View Premium Products
            </Link>
          </div>
        </div>
        </section>

    <CustomDesignCTA />
  </section>

  <footer className="footer">
    <div className="footer-columns">
      <div className="footer-column">
        <h3 style={{fontFamily:"'Dancing Script', cursive"}}>Retro Revival</h3>
        <p style={{whiteSpace:"normal", wordWrap:"break-word",overflowWrap:"break-word",margin:"0rem"}}>Bringing vintage aesthetics to modern fashion with carefully curated pieces that tell a story.</p>
      </div>

    <div className="footer-column" style={{margin:"0rem"}}>
      <h3>Categories</h3>
      <ul>
        <li><Link to="/details/tshirts">T-Shirts</Link></li>
        <li><Link to="/details/shirts">Shirts</Link></li>
        <li><Link to="/details/jerseys">Jerseys</Link></li>
        <li><Link to="/details/hoodies">Hoodies</Link></li>
        <li><Link to="/details/caps">Caps</Link></li>
        <li><Link to="/details/uniform">Uniforms</Link></li>
      </ul>
    </div>

    <div className="footer-column">
      <h3>Support</h3>
      <ul>
        <li><Link to="/details/size_guide">Size Guide</Link></li>
        <li><Link to="/details/shipping">Shipping</Link></li>
        <li><Link to="/details/returns">Return & Exchanges</Link></li>
      </ul>
    </div>

    <div className="footer-column">
      <h3>Connect With Us</h3>
      <div className="social-icons">
        
        <a href="https://wa.me/917306638887" target="_blank" rel="noopener noreferrer">
            <img src="wht1.svg" alt="WhatsApp" style={{backgroundColor:"white",width:"35px",height:"35px", borderRadius:"50%" }} />
          </a>
        <a href="https://www.instagram.com/Wear_your__style" target="_blank" rel="noopener noreferrer">
          <img src="insta.svg" alt="Instagram"  style={{backgroundColor:"white",width:"35px",height:"35px", borderRadius:"50%" }}/>
        </a>
        <a href="https://www.facebook.com/share/16pTpETHTH/" target="_blank" rel="noopener noreferrer" >
          <img src="face.svg" alt="Facebook" style={{backgroundColor:"white",width:"35px",height:"35px", borderRadius:"50%" }}/>
        </a>
        
      </div>
      <p>Follow us for daily style inspiration and exclusive promotions delivered straight to your feed.</p>
    </div>
  </div>

  <div className="footer-bottom">
    <p>©2025 Retro Revival. All rights reserved.</p>
    <div className="footer-links">
      <Link to="/privacy">Privacy Policy</Link>
      <Link to="/privacy#terms">Terms of Service</Link>
    </div>
  </div>
</footer>

    </div>
  )
}

export default Home


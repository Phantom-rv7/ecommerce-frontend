import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLatestProductsQuery } from "../redux/api/productAPI"
import { Skeleton } from "../components/loader"


const DescribeDetails = () => {
  const { category } = useParams();
  const tshirtsRef = useRef<HTMLDivElement>(null);
  const shirtsRef = useRef<HTMLDivElement>(null);
  const jerseysRef = useRef<HTMLDivElement>(null);
  const hoodiesRef = useRef<HTMLDivElement>(null);
  const capsRef = useRef<HTMLDivElement>(null);
  const uniformRef = useRef<HTMLDivElement>(null);
  const size_guideRef = useRef<HTMLDivElement>(null);
  const returnsRef = useRef<HTMLDivElement>(null);
  const shippingRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useLatestProductsQuery("")
 

  useEffect(() => {
    const scrollToSection = () => {
      if (category === 'tshirts') tshirtsRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'shirts') shirtsRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'jerseys') jerseysRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'hoodies') hoodiesRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'caps') capsRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'uniform') uniformRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'size_guide') size_guideRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'returns') returnsRef.current?.scrollIntoView({ behavior: 'smooth' });
      else if (category === 'shipping') shippingRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToSection();
  }, [category]);


  return (
  isLoading ? (
    <Skeleton width="100vw" length={10} />
  ) : (
    <div>
      
      <div className="describe-details" ref={tshirtsRef}>
        <h1>Explore Retro Revival Categories</h1>
        <h2>👕 T-Shirts</h2>
        <p>
          Retro Revival T-Shirts blend timeless graphics with modern fits. Crafted from soft, breathable cotton, each tee delivers everyday comfort with a bold, nostalgic twist.<br /><br />
          - 🧵 <strong>Material:</strong> 100% Cotton<br />
          - 📐 <strong>Fit:</strong> Regular / Oversized options<br />
          - ✨ <strong>Features:</strong> Vintage-inspired prints, ribbed crew neck<br />
          - 🎯 <strong>Style Tip:</strong> Pair with denim or joggers for effortless throwback cool<br />
        </p>
      </div>

      <div className="describe-details" ref={shirtsRef}>
        <h2>👔 Shirts</h2>
        <p>
          Our Retro Revival Shirts bring tailored structure to casual cool. Think clean lines, subtle textures, and just the right amount of retro detailing.<br /><br />
          - 🧵 <strong>Material:</strong> Cotton / Linen blends<br />
          - 📐 <strong>Fit:</strong> Slim / Relaxed<br />
          - ✨ <strong>Features:</strong> Button-down front, chest pocket, contrast stitching<br />
          - 🎯 <strong>Style Tip:</strong> Wear open over a tee or buttoned up for a polished throwback look<br />
        </p>
      </div>

      <div className="describe-details" ref={jerseysRef}>
        <h2>🏆 Jerseys</h2>
        <p>
          Retro Revival Jerseys are built for performance and style. Inspired by vintage athletic wear, they feature breathable fabrics, bold graphics, and a fit that moves with you.<br /><br />
          - 🧵 <strong>Material:</strong> Lightweight mesh or dri-fit blends<br />
          - 📐 <strong>Fit:</strong> Athletic / Relaxed<br />
          - ✨ <strong>Features:</strong> Number and name customization, moisture-wicking, contrast piping<br />
          - 🏀 <strong>Use Case:</strong> Sports teams, fanwear, streetwear collections<br />
          - 🎯 <strong>Style Tip:</strong> Pair with joggers or shorts for a full throwback game-day look<br />
        </p>
      </div>

      <div className="describe-details" ref={hoodiesRef}>
        <h2>🧥 Hoodies</h2>
        <p>
          Stay cozy in style with our Retro Revival Hoodies — a fusion of streetwear edge and retro charm. Whether pullover or zip-up, they’re built for layering and lounging.<br /><br />
          - 🧵 <strong>Material:</strong> Cotton-poly fleece blend<br />
          - 📐 <strong>Fit:</strong> Relaxed / Boxy silhouette<br />
          - ✨ <strong>Features:</strong> Kangaroo pocket, drawstring hood, graphic embroidery<br />
          - 🧊 <strong>Style Tip:</strong> Layer over tees or under jackets for year-round versatility<br />
        </p>
      </div>

      <div className="describe-details" ref={capsRef}>
        <h2>🧢 Caps</h2>
        <p>
          Top off your look with Retro Revival Caps, designed for shade and statement. From classic dad caps to bold snapbacks, each piece adds a finishing touch to your fit.<br /><br />
          - 🧵 <strong>Material:</strong> Cotton twill / Canvas<br />
          - 🔒 <strong>Closure:</strong> Adjustable strap / Snapback<br />
          - ✨ <strong>Features:</strong> Embroidered logo, curved or flat brim<br />
          - 🎽 <strong>Style Tip:</strong> Match with graphic tees or hoodies for a complete streetwear vibe<br />
        </p>
      </div>

      <div className="describe-details" ref={uniformRef}>
        <h2>👕 Uniforms with Printed Logos</h2>
        <p>
          Retro Revival Uniforms combine clean design with custom branding. Whether for teams, staff, or events, our logo-printed uniforms deliver a polished, unified look with lasting comfort.<br /><br />
          - 🧵 <strong>Material:</strong> Durable cotton/poly blends<br />
          - 📐 <strong>Fit:</strong> Standard / Tailored options<br />
          - 🎨 <strong>Features:</strong> Custom logo printing, reinforced stitching, breathable fabric<br />
          - 🏢 <strong>Use Case:</strong> Corporate teams, school groups, hospitality, events<br />
          - 🎯 <strong>Style Tip:</strong> Choose bold logo placement for maximum brand visibility<br />
        </p>
      </div>

      <div className="describe-details" ref={size_guideRef}>
        <h2>📏 Size Guide Description</h2>
        <p>
          Find your perfect fit with Retro Revival’s Size Guide.<br />
          We know that comfort and confidence start with the right size — that’s why we’ve made it easy to choose. Whether you prefer a relaxed streetwear vibe or a tailored silhouette, our guide helps you match your measurements to our styles.<br />
          - 📐 <strong>How to Measure:</strong> Follow simple steps to measure your chest, waist, hips, and height accurately.<br />
          - 👕 <strong>Fit Types Explained:</strong> Learn the difference between Regular, Oversized, Slim, and Relaxed fits.<br />
          - 📊 <strong>Size Charts:</strong> Compare your measurements with our detailed charts for each product category.<br />
          - 🧵 <strong>Fabric & Stretch Notes:</strong> We include notes on material flexibility so you know what to expect.<br />
          - 🔁 <strong>Still Unsure?</strong> Our customer support team is here to help with sizing questions or exchanges.<br />
        </p>
      </div>

      <div className="describe-details" ref={shippingRef}>
        <h2>🚚 Shipping</h2>
        <p>
          Fast, reliable delivery — from our studio to your doorstep.<br />
          Retro Revival ships across India with trusted partners to ensure your order arrives safely and on time.<br />
          - 📍 <strong>Coverage:</strong> Pan-India delivery available.<br />
          - ⏱️ <strong>Dispatch Time:</strong> Orders ship within 2–4 business days.<br />
          - 🚚 <strong>Delivery Time:</strong> Typically 7–10 business days depending on location.<br />
          - 💳 <strong>Shipping Charges:</strong> Shipping of orders are from ₹30 – ₹100.<br />
          - 📦 <strong>Tracking:</strong> You can check your order status on Orders.<br />
        </p>
      </div>

       <div className="describe-details" ref={returnsRef}>
        <h2>🔁 Returns & Exchanges</h2>
        <p>
          Retro Revival Uniforms combine clean design with custom branding. Whether for teams, staff, or events, our logo-printed uniforms deliver a polished, unified look with lasting comfort.<br />
         - 👕 <strong>Material:</strong> Durable cotton/poly blends.<br />
         - 📐 <strong>Fit:</strong> Standard / Tailored options.<br />
         - 🧵 <strong>Features:</strong> Custom logo printing, reinforced stitching, breathable fabric.<br />
         - 🏢 <strong>Use Case:</strong> Corporate teams, school groups, hospitality, events.<br />
         - 🎯 <strong>Style Tip:</strong> Choose bold logo placement for maximum brand visibility.<br />
        </p>
      </div>

    </div>
  )
);
};

export default DescribeDetails;

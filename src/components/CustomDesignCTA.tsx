import React from "react";

const CustomDesignCTA: React.FC = () => {
  const handleRedirect = (platform: "instagram" | "whatsapp") => {
    if (platform === "instagram") {
      window.open("https://www.instagram.com/Wear_your__style", "_blank");
    } else {
      const message = encodeURIComponent("Hi! I'd like to share my custom design.");
      window.open(`https://wa.me/917306638887?text=${message}`, "_blank");
    }
  };

  return (
    <section className="custom-design-cta">
      <h2>Got Your Own Design?</h2>
      <p>Send us your custom artwork, photos, or ideas via Instagram or WhatsApp. We’ll bring your vision to life!</p>
      <div className="cta-button-group">
        <button className="cta-button instagram" onClick={() => handleRedirect("instagram")}>
          📸 Send via Instagram
        </button>
        <button className="cta-button whatsapp" onClick={() => handleRedirect("whatsapp")}>
          💬 Send via WhatsApp
        </button>
      </div>
    </section>
  );
};

export default CustomDesignCTA;

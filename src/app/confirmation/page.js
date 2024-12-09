'use client';

import { useEffect, useState } from 'react';

const ConfirmationPage = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadKlarnaCheckout = () => {
      console.log("Initializing Klarna Checkout...");

      // Se till att `Klarna.Checkout` laddas korrekt
      if (window.Klarna && window.Klarna.Checkout) {
        window.Klarna.Checkout.load({
          container: "#klarna-checkout-container",
        });
      } else {
        console.error("Klarna Checkout is not available.");
        setError("Klarna Checkout could not be loaded.");
      }
    };

    // Dynamisk laddning av Klarna Checkout-script
    const script = document.createElement("script");
    script.src = "https://x.klarnacdn.net/checkout/lib/v1/checkout.js";
    script.async = true;
    script.onload = loadKlarnaCheckout;
    script.onerror = () => {
      console.error("Failed to load Klarna Checkout script.");
      setError("Failed to load Klarna Checkout.");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Rensa script när komponenten unmountas
    };
  }, []);

  return (
    <div>
      <h1>Order Confirmation</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p>Loading your order confirmation...</p>
          <div id="klarna-checkout-container" style={{ marginTop: "20px" }}></div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationPage;

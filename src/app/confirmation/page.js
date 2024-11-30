// /app/confirmation/page.js (or /pages/confirmation.js if using Pages Directory)

import { useEffect, useState } from 'react';

const ConfirmationPage = () => {
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    // Retrieve the Klarna order ID or other relevant data from query params or session
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id'); // This could be in the URL as a query parameter

    if (orderId) {
      // Fetch the order details (e.g., from your backend or Klarna API)
      fetch(`/api/get-order/${orderId}`)
        .then((response) => response.json())
        .then((data) => setOrderStatus(data))
        .catch((error) => console.error('Error fetching order details:', error));
    }
  }, []);

  return (
    <div>
      <h1>Order Confirmation</h1>
      {orderStatus ? (
        <div>
          <h2>Thank you for your purchase!</h2>
          <p>Order ID: {orderStatus.id}</p>
          <p>Status: {orderStatus.status}</p>
          {/* You can display more details like items purchased, total price, etc. */}
        </div>
      ) : (
        <p>Loading your order status...</p>
      )}
    </div>
  );
};

export default ConfirmationPage;

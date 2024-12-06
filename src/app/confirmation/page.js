'use client';

import { useEffect, useState } from 'react';

const ConfirmationPage = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id'); // Klarna skickar 'order_id' i URL:en

    if (orderId) {
      fetch(`/api/get-order/${orderId}`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch order details');
          return response.json();
        })
        .then((data) => setOrderStatus(data))
        .catch((err) => {
          console.error('Error fetching order details:', err);
          setError('Failed to retrieve order details.');
        });
    } else {
      setError('Order ID is missing in the URL.');
    }
  }, []);

  return (
    <div>
      <h1>Order Confirmation</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : orderStatus ? (
        <div>
          <h2>Thank you for your purchase!</h2>
          <p>Order ID: {orderStatus.id}</p>
          <p>Status: {orderStatus.status}</p>
          {/* Display additional details like items and prices */}
        </div>
      ) : (
        <p>Loading your order status...</p>
      )}
    </div>
  );
};

export default ConfirmationPage;

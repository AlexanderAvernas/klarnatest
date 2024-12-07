'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const ConfirmationPage = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id'); // Klarna sends 'order_id' in the URL
    console.log('Order ID:', orderId); // Log Order ID

    if (orderId) {
      // Fetch order details from your backend
      fetch(`/api/get-order/${orderId}`)
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch order details');
          return response.json();
        })
        .then((data) => {
          console.log('Order details response:', data); // Log order details
          setOrderStatus(data);
        })
        .catch((err) => {
          console.error('Error fetching order details:', err); // Log the error
          setError('Failed to retrieve order details.');
        });

      // Load the Klarna Confirmation Widget
      window.Klarna?.Payments?.load({
        container: '#klarna-confirmation-container',
        instance_id: 'klarna-confirmation',
        options: {
          order_id: orderId,
        },
      });
    } else {
      console.error('Order ID is missing in the URL.'); // Log missing order ID
      setError('Order ID is missing in the URL.');
    }
  }, []);

  return (
    <div>
      <Script src="https://x.klarnacdn.net/kp/lib/v1/api.js" strategy="lazyOnload" />

      <h1>Order Confirmation</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : orderStatus ? (
        <div>
          <h2>Thank you for your purchase!</h2>
          <p>Order ID: {orderStatus.order_id}</p>
          <p>Status: {orderStatus.status}</p>
          {/* Display additional details like items and prices */}
        </div>
      ) : (
        <p>Loading your order status...</p>
      )}

      {/* Klarna Confirmation Widget container */}
      <div id="klarna-confirmation-container" style={{ marginTop: '20px' }}></div>
    </div>
  );
};

export default ConfirmationPage;

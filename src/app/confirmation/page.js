'use client';

import { useEffect, useState } from 'react';

const ConfirmationPage = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [htmlSnippet, setHtmlSnippet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    console.log('Order ID:', orderId);

    if (orderId) {
      // Fetch order details from backend
      fetch(`/api/get-order/${orderId}`)
        .then((response) => {
          console.log('Fetch response:', response);
          if (!response.ok) throw new Error(`API error: ${response.statusText}`);
          return response.json();
        })
        .then((data) => {
          console.log('Order details response:', data);
          setOrderStatus(data.status); // Set the order status (e.g., CAPTURED, AUTHORIZED, etc.)
          setHtmlSnippet(data.html_snippet); // Set the Klarna Checkout confirmation HTML snippet
        })
        .catch((err) => {
          console.error('Error fetching order details:', err);
          setError('Failed to retrieve order details.');
        });
    } else {
      console.error('Order ID is missing in the URL.');
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
          <p>Order ID: {orderStatus.order_id}</p>
          <p>Status: {orderStatus}</p>
        </div>
      ) : (
        <p>Loading your order status...</p>
      )}

      {/* Embed the Klarna Checkout confirmation snippet */}
      {htmlSnippet && (
        <div
          id="klarna-confirmation-container"
          dangerouslySetInnerHTML={{ __html: htmlSnippet }}
        />
      )}
    </div>
  );
};

export default ConfirmationPage;

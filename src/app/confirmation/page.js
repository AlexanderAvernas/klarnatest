'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const ConfirmationPage = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    console.log('Order ID:', orderId); // Första loggen: Kontrollera Order ID från URL

    if (orderId) {
      // Kontrollera att Klarna-biblioteket är laddat
      console.log('Is Klarna available?', window.Klarna);

      // Fetch order details från backend
      fetch(`/api/get-order/${orderId}`)
        .then((response) => {
          console.log('Fetch response:', response); // Loggar hela fetch-responsen
          if (!response.ok) throw new Error(`API error: ${response.statusText}`);
          return response.json();
        })
        .then((data) => {
          console.log('Order details response:', data); // Loggar orderdetaljerna
          setOrderStatus(data);
        })
        .catch((err) => {
          console.error('Error fetching order details:', err); // Loggar fetch-fel
          setError('Failed to retrieve order details.');
        });

      // Kontrollera om Klarna Payments finns
      console.log('Klarna Payments:', window.Klarna?.Payments);

      if (window.Klarna?.Payments) {
        // Kontrollera om container-elementet existerar
        console.log('Container element exists:', document.querySelector('#klarna-confirmation-container'));

        // Försök ladda Klarna Confirmation Widget
        window.Klarna.Payments.load({
          container: '#klarna-confirmation-container',
          instance_id: 'klarna-confirmation',
          options: {
            order_id: orderId,
          },
        }, (result) => {
          console.log('Klarna Load Result:', result); // Loggar resultat från Klarna-widgeten
          if (result?.error) {
            console.error('Klarna widget error:', result.error); // Loggar Klarna-fel om det finns
          }
        }).then(() => {
          console.log('Klarna Confirmation Widget loaded successfully.');
        }).catch((err) => {
          console.error('Error loading Klarna Confirmation Widget:', err); // Loggar fel vid widget-laddning
        });
      } else {
        console.error('Klarna Payments API is not available.');
      }
    } else {
      console.error('Order ID is missing in the URL.');
      setError('Order ID is missing in the URL.');
    }
  }, []);

  return (
    <div>
      <Script src="https://x.klarnacdn.net/kp/lib/v1/api.js" strategy="lazyOnload" onLoad={() => {
        console.log('Klarna script loaded successfully.');
      }} />

      <h1>Order Confirmation</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : orderStatus ? (
        <div>
          <h2>Thank you for your purchase!</h2>
          <p>Order ID: {orderStatus.order_id}</p>
          <p>Status: {orderStatus.status}</p>
        </div>
      ) : (
        <p>Loading your order status...</p>
      )}

      <div id="klarna-confirmation-container" style={{ marginTop: '20px' }}></div>
    </div>
  );
};

export default ConfirmationPage;

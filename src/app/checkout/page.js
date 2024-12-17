'use client';

import { useState } from 'react';
import KlarnaWidget from '../components/KlarnaWidget';

// React component for Klarna Checkout page
const CheckoutPage = () => {
  const [htmlSnippet, setHtmlSnippet] = useState(''); // State to store Klarna widget HTML

  const createOrder = async () => {
    try {
      const response = await fetch('/api/klarna-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchase_country: 'SE', // Sweden
          purchase_currency: 'SEK', // Swedish Kronor
          locale: 'sv-SE', // Swedish language
          order_amount: 10000, // Total amount in minor units (100.00 SEK)
          order_tax_amount: 2000, // Tax amount in minor units (20.00 SEK)
          order_lines: [
            {
              type: 'physical', // Indicates a physical product
              reference: '123456789', // Product reference ID
              name: 'Test Product', // Product name
              quantity: 1, // Quantity
              quantity_unit: 'st', // Swedish unit for "pieces"
              unit_price: 10000, // Price per unit (100.00 SEK)
              tax_rate: 2500, // 25% VAT (in basis points)
              total_amount: 10000, // Total price (100.00 SEK)
              total_tax_amount: 2000, // Total tax (20.00 SEK)
            },
          ],
          merchant_urls: {
            terms: 'https://klarnatest.netlify.app/terms', // Terms and conditions URL
            checkout: 'https://klarnatest.netlify.app/checkout', // Checkout URL
            confirmation: 'https://klarnatest.netlify.app/confirmation?order_id={checkout.order.id}', // Dynamic Confirmation URL
            push: 'https://webhook.site/06bd1065-15cc-45dd-8317-1219f713092e?order_id={checkout.order.id}' // push with id
          },
        }),
      });

      const data = await response.json(); // Parse response
      setHtmlSnippet(data.html_snippet); // Set Klarna widget snippet
    } catch (error) {
      console.error('Error creating order:', error); // Debugging: Log any error
    }
  };

  return (
    <div>
      <button onClick={createOrder}>Create Klarna Order</button> {/* Button to create order */}
      {htmlSnippet && <KlarnaWidget htmlSnippet={htmlSnippet} />} {/* Render Klarna widget */}
    </div>
  );
};

export default CheckoutPage;

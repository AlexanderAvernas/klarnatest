import axios from 'axios';

const klarnaApi = axios.create({
  baseURL: 'https://api.playground.klarna.com', // Klarna Test API endpoint
  auth: {
    username: process.env.KLARNA_USERNAME, // Use environment variables for credentials
    password: process.env.KLARNA_PASSWORD,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create an order using Klarna API
export const createKlarnaOrder = async (orderDetails) => {
  try {
    const response = await klarnaApi.post('/checkout/v3/orders', orderDetails);
    return response.data;
  } catch (error) {
    console.error('Error creating Klarna order:', error.response?.data || error.message);
    throw error;
  }
};

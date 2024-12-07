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

// Fetch Klarna order details by order ID
export const getKlarnaOrder = async (orderId) => {
    try {
      const response = await klarnaApi.get(`/checkout/v3/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Klarna order:', error.response?.data || error.message);
      throw error;
    }
  };

  // Fetch Klarna order details from Order Management API
export const getKlarnaOrderManagement = async (orderId) => {
    try {
      const response = await klarnaApi.get(`/ordermanagement/v1/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order from Order Management API:', error.response?.data || error.message);
      throw error;
    }
  };


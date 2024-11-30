import { createKlarnaOrder } from '../../utils/klarnaApi'; // Your Klarna API utility

// API to get Klarna order details by order ID
export async function GET(req, { params }) {
  const { orderId } = params;

  try {
    const orderDetails = await createKlarnaOrder(orderId); // Use your Klarna API function to fetch order details
    return new Response(JSON.stringify(orderDetails), { status: 200 });
  } catch (error) {
    console.error('Error fetching Klarna order:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to fetch order details',
        details: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}

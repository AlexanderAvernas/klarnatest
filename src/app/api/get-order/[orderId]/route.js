import { getKlarnaOrder } from '../../../utils/klarnaApi';

export async function GET(req, { params }) {
  const { orderId } = params;

  try {
    const orderDetails = await getKlarnaOrder(orderId); // Fetch order details from Klarna
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

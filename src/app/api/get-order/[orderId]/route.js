import { getKlarnaOrder } from '../../../utils/klarnaApi';

export async function GET(req, { params }) {
  const { orderId } = params;

  console.log(`Fetching order details for Order ID: ${orderId}`);

  try {
    // Fetch the order details from Klarna's Checkout API
    const orderDetails = await getKlarnaOrder(orderId);

    console.log('Order details from Klarna:', orderDetails);

    // Return the full order details, including the `html_snippet`
    return new Response(JSON.stringify(orderDetails), { status: 200 });
  } catch (error) {
    console.error('Error fetching Klarna order:', error.response?.data || error.message);

    return new Response(
      JSON.stringify({
        message: 'Failed to fetch order details',
        details: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}

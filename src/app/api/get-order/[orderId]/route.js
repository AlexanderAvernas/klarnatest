import { getKlarnaOrder, getKlarnaOrderManagement } from '../../../utils/klarnaApi';

export async function GET(req, { params }) {
  const { orderId } = params;

  console.log(`Fetching order details for Order ID: ${orderId}`); // Log Order ID

  try {
    // Hämta order från Checkout API
    console.log('Fetching from Checkout API...');
    const orderDetails = await getKlarnaOrder(orderId);
    console.log('Checkout API response:', orderDetails); // Log response från Checkout API

    // Om status är checkout_complete, hämta från Order Management API
    if (orderDetails.status === 'checkout_complete') {
      console.log('Order is checkout_complete. Fetching details from Order Management API...');
      const managedOrderDetails = await getKlarnaOrderManagement(orderId);
      console.log('Order Management API response:', managedOrderDetails); // Log response från Order Management API
      return new Response(JSON.stringify(managedOrderDetails), { status: 200 });
    }

    // Annars returnera Checkout API-detaljer
    console.log('Order is NOT checkout_complete. Returning Checkout API details...');
    return new Response(JSON.stringify(orderDetails), { status: 200 });
  } catch (error) {
    console.error('Error fetching Klarna order:', error.response?.data || error.message); // Log API-fel
    return new Response(
      JSON.stringify({
        message: 'Failed to fetch order details',
        details: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}

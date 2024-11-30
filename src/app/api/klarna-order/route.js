import { createKlarnaOrder } from '../../utils/klarnaApi';

export async function POST(req) {
  try {
    const orderDetails = await req.json(); // Parse incoming request JSON body
    console.log('Received order details:', orderDetails);
    const klarnaOrder = await createKlarnaOrder(orderDetails); // Create the Klarna order using your utility function
    console.log('Klarna Order Created:', klarnaOrder);
    return new Response(JSON.stringify(klarnaOrder), { status: 200 });
  } catch (error) {
    console.error('Error creating Klarna order:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to create Klarna order',
        details: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}

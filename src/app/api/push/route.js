export async function POST(req) {
    try {
      const orderDetails = await req.json(); // Parse incoming push notification
      console.log('Received Klarna Push Notification:', orderDetails);

      // You could validate the push request here (optional, based on Klarna setup)

      // Log or store the updated order status in your database
      // Example: const updatedOrder = await updateOrderStatus(orderDetails);

      return new Response(JSON.stringify({ message: 'Push notification handled' }), {
        status: 200,
      });
    } catch (error) {
      console.error('Error handling Klarna Push notification:', error);
      return new Response(
        JSON.stringify({
          message: 'Failed to handle Klarna push notification',
          details: error.message,
        }),
        { status: 500 }
      );
    }
  }

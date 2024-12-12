// export async function POST(req) {
//     try {
//       const orderDetails = await req.json(); // Parse incoming push notification
//       console.log('Received Klarna Push Notification:', orderDetails);

//       // You could validate the push request here (optional, based on Klarna setup)

//       // Log or store the updated order status in your database
//       // Example: const updatedOrder = await updateOrderStatus(orderDetails);

//       return new Response(JSON.stringify({ message: 'Push notification handled' }), {
//         status: 200,
//       });
//     } catch (error) {
//       console.error('Error handling Klarna Push notification:', error);
//       return new Response(
//         JSON.stringify({
//           message: 'Failed to handle Klarna push notification',
//           details: error.message,
//         }),
//         { status: 500 }
//       );
//     }
//   }

export async function POST(req) {
    try {
        // Parse den inkommande push-notifikationen från Klarna
        const orderDetails = await req.json();

        // Logga informationen från Klarna för framtida referens
        console.log('Received Klarna Push Notification:', orderDetails);

        // Validera att notifikationen innehåller rätt struktur (valfritt)
        if (!orderDetails.order_id || !orderDetails.status) {
            console.warn('Invalid push notification received:', orderDetails);
            return new Response(
                JSON.stringify({ message: 'Invalid push notification data' }),
                { status: 400 } // Returnera felstatus om datan är felaktig
            );
        }

        // Logga tydlig information om ordern
        console.log(`Order ID: ${orderDetails.order_id}`);
        console.log(`Order Status: ${orderDetails.status}`);
        console.log(`Customer Info: ${JSON.stringify(orderDetails.customer, null, 2)}`);
        console.log(`Order Lines: ${JSON.stringify(orderDetails.order_lines, null, 2)}`);

        // Om du vill, lägg till ett meddelande för dig själv i loggen
        console.log('Note: Order details can be reviewed manually in the Klarna Merchant Portal.');

        // Svara Klarna med att pushen har hanterats
        return new Response(
            JSON.stringify({ message: 'Push notification handled successfully' }),
            { status: 200 }
        );
    } catch (error) {
        // Logga eventuella fel som inträffar
        console.error('Error handling Klarna Push Notification:', error);

        // Svara Klarna med ett felmeddelande (valfritt)
        return new Response(
            JSON.stringify({
                message: 'Failed to handle Klarna push notification',
                details: error.message,
            }),
            { status: 500 }
        );
    }
}

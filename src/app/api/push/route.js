export async function POST(req) {
    try {
        // Parse the incoming push notification from Klarna
        const orderDetails = await req.json();

        // Immediately respond to Klarna to acknowledge receipt
        const response = new Response(
            JSON.stringify({ message: 'Push notification handled successfully' }),
            { status: 200 }
        );

        // Process and log relevant order details asynchronously
        (async () => {
            console.log('--- Order Received from Klarna ---');
            console.log(`Order ID: ${orderDetails.order_id}`);
            console.log(`Order Status: ${orderDetails.status}`);

            // Log buyer information (shipping address)
            const { given_name, family_name, email, street_address, postal_code, city, country } = orderDetails.shipping_address;
            console.log('--- Buyer Information ---');
            console.log(`Name: ${given_name} ${family_name}`);
            console.log(`Email: ${email}`);
            console.log(`Address: ${street_address}, ${postal_code}, ${city}, ${country}`);

            // Log product details
            console.log('--- Products in Order ---');
            orderDetails.order_lines.forEach((line, index) => {
                console.log(`Product ${index + 1}: ${line.name}`);
                console.log(`  Quantity: ${line.quantity}`);
                console.log(`  Unit Price: ${line.unit_price / 100} ${orderDetails.purchase_currency}`);
                console.log(`  Total Price: ${line.total_amount / 100} ${orderDetails.purchase_currency}`);
            });

            console.log('--- End of Order ---');
        })();

        return response; // Return early to Klarna
    } catch (error) {
        console.error('Error handling Klarna Push Notification:', error);

        return new Response(
            JSON.stringify({
                message: 'Failed to handle Klarna push notification',
                details: error.message,
            }),
            { status: 500 }
        );
    }
}

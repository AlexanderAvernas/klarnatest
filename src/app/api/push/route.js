export async function POST(req) {
    try {
        // Parse Klarna push notification JSON
        const orderDetails = await req.json();

        // Log incoming data for debugging (optional in production)
        console.log('--- Klarna Push Notification ---');
        console.log('Received Order Details:', JSON.stringify(orderDetails, null, 2));

        // Respond to Klarna immediately
        const response = new Response(
            JSON.stringify({ message: 'Push notification received successfully' }),
            { status: 200 }
        );

        // Asynchronously process the order
        (async () => {
            try {
                console.log('--- Order Details ---');
                console.log(`Order ID: ${orderDetails.order_id}`);
                console.log(`Order Status: ${orderDetails.status}`);

                // Log shipping address
                const { given_name, family_name, email, street_address, postal_code, city, country } =
                    orderDetails.shipping_address || {};
                console.log('--- Buyer Information ---');
                console.log(`Name: ${given_name || 'N/A'} ${family_name || 'N/A'}`);
                console.log(`Email: ${email || 'N/A'}`);
                console.log(`Address: ${street_address || 'N/A'}, ${postal_code || 'N/A'}, ${city || 'N/A'}, ${country || 'N/A'}`);

                // Log product details
                console.log('--- Products in Order ---');
                (orderDetails.order_lines || []).forEach((line, index) => {
                    console.log(`Product ${index + 1}: ${line.name || 'N/A'}`);
                    console.log(`  Quantity: ${line.quantity || 'N/A'}`);
                    console.log(`  Unit Price: ${(line.unit_price / 100 || 'N/A')} ${orderDetails.purchase_currency || 'N/A'}`);
                    console.log(`  Total Price: ${(line.total_amount / 100 || 'N/A')} ${orderDetails.purchase_currency || 'N/A'}`);
                });
                console.log('--- End of Order ---');
            } catch (error) {
                console.error('Error processing Klarna order:', error);
            }
        })();

        return response; // Send response to Klarna
    } catch (error) {
        console.error('Error handling Klarna Push Notification:', error);

        // Log raw request body for debugging
        try {
            console.error('Raw request body:', await req.text());
        } catch (readError) {
            console.error('Failed to read raw request body:', readError.message);
        }

        return new Response(
            JSON.stringify({
                message: 'Failed to handle Klarna push notification',
                details: error.message,
            }),
            { status: 500 }
        );
    }
}

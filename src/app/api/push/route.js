export async function POST(req) {
    try {
        // Check if the request has a body
        if (!req.body) {
            console.error('Error: Request body is missing');
            return new Response(
                JSON.stringify({ message: 'Request body is missing' }),
                { status: 400 }
            );
        }

        // Parse the incoming push notification from Klarna
        const orderDetails = await req.json();

        // Validate the parsed JSON
        if (!orderDetails || typeof orderDetails !== 'object') {
            console.error('Error: Invalid JSON received');
            return new Response(
                JSON.stringify({ message: 'Invalid JSON received' }),
                { status: 400 }
            );
        }

        // Immediately respond to Klarna
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
            const { given_name, family_name, email, street_address, postal_code, city, country } = orderDetails.shipping_address || {};
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

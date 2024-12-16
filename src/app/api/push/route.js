export async function POST(req) {
    try {
        // Läs body som text först för att hantera tomma bodies
        const rawBody = await req.text();

        // Kontrollera om body:n är tom
        if (!rawBody) {
            console.log('Tom body mottagen och hanterad korrekt.');
            return new Response(
                JSON.stringify({ message: 'Empty body handled successfully' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Försök att parsa Klarna push notification JSON
        const orderDetails = JSON.parse(rawBody);

        // Logga inkommande data för debugging (valfritt i produktion)
        console.log('--- Klarna Push Notification ---');
        console.log('Received Order Details:', JSON.stringify(orderDetails, null, 2));

        // Svara Klarna omedelbart
        const response = new Response(
            JSON.stringify({ message: 'Push notification received successfully' }),
            { status: 200 }
        );

        // Bearbeta ordern asynkront
        (async () => {
            try {
                console.log('--- Order Details ---');
                console.log(`Order ID: ${orderDetails.order_id}`);
                console.log(`Order Status: ${orderDetails.status}`);

                // Logga leveransadress
                const { given_name, family_name, email, street_address, postal_code, city, country } =
                    orderDetails.shipping_address || {};
                console.log('--- Buyer Information ---');
                console.log(`Name: ${given_name || 'N/A'} ${family_name || 'N/A'}`);
                console.log(`Email: ${email || 'N/A'}`);
                console.log(`Address: ${street_address || 'N/A'}, ${postal_code || 'N/A'}, ${city || 'N/A'}, ${country || 'N/A'}`);

                // Logga produktdetaljer
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

        return response; // Skicka svar till Klarna
    } catch (error) {
        console.error('Error handling Klarna Push Notification:', error);

        // Logga raw request body för debugging
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

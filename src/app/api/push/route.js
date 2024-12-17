// export async function POST(req) {
//     try {
//         // Läs body som text först för att hantera tomma bodies
//         const rawBody = await req.text();

//         // Kontrollera om body:n är tom
//         if (!rawBody) {
//             console.log('Tom body mottagen och hanterad korrekt.');
//             return new Response(
//                 JSON.stringify({ message: 'Empty body handled successfully' }),
//                 { status: 200, headers: { 'Content-Type': 'application/json' } }
//             );
//         }

//         // Försök att parsa Klarna push notification JSON
//         const orderDetails = JSON.parse(rawBody);

//         // Logga inkommande data för debugging (valfritt i produktion)
//         console.log('--- Klarna Push Notification ---');
//         console.log('Received Order Details:', JSON.stringify(orderDetails, null, 2));

//         // Svara Klarna omedelbart
//         const response = new Response(
//             JSON.stringify({ message: 'Push notification received successfully' }),
//             { status: 200 }
//         );

//         // Bearbeta ordern asynkront
//         (async () => {
//             try {
//                 console.log('--- Order Details ---');
//                 console.log(`Order ID: ${orderDetails.order_id}`);
//                 console.log(`Order Status: ${orderDetails.status}`);

//                 // Logga leveransadress
//                 const { given_name, family_name, email, street_address, postal_code, city, country } =
//                     orderDetails.shipping_address || {};
//                 console.log('--- Buyer Information ---');
//                 console.log(`Name: ${given_name || 'N/A'} ${family_name || 'N/A'}`);
//                 console.log(`Email: ${email || 'N/A'}`);
//                 console.log(`Address: ${street_address || 'N/A'}, ${postal_code || 'N/A'}, ${city || 'N/A'}, ${country || 'N/A'}`);

//                 // Logga produktdetaljer
//                 console.log('--- Products in Order ---');
//                 (orderDetails.order_lines || []).forEach((line, index) => {
//                     console.log(`Product ${index + 1}: ${line.name || 'N/A'}`);
//                     console.log(`  Quantity: ${line.quantity || 'N/A'}`);
//                     console.log(`  Unit Price: ${(line.unit_price / 100 || 'N/A')} ${orderDetails.purchase_currency || 'N/A'}`);
//                     console.log(`  Total Price: ${(line.total_amount / 100 || 'N/A')} ${orderDetails.purchase_currency || 'N/A'}`);
//                 });
//                 console.log('--- End of Order ---');
//             } catch (error) {
//                 console.error('Error processing Klarna order:', error);
//             }
//         })();

//         return response; // Skicka svar till Klarna
//     } catch (error) {
//         console.error('Error handling Klarna Push Notification:', error);

//         // Logga raw request body för debugging
//         try {
//             console.error('Raw request body:', await req.text());
//         } catch (readError) {
//             console.error('Failed to read raw request body:', readError.message);
//         }

//         return new Response(
//             JSON.stringify({
//                 message: 'Failed to handle Klarna push notification',
//                 details: error.message,
//             }),
//             { status: 500 }
//         );
//     }
// }

import { getKlarnaOrder } from '../../utils/klarnaApi'; // Importera din axios-baserade funktion för att hämta Klarna order

export async function POST(req) {
    try {
        // Logga inkommande headers för debugging
        console.log('--- Inkommande Headers ---');
        console.log(JSON.stringify(Object.fromEntries(req.headers), null, 2));

        // Hämta query-parametrar
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('order_id'); // Hämta order_id från query-parametern

        // Kontrollera om order_id finns
        if (!orderId) {
            console.error('Ingen order_id hittades i query-parametrarna.');
            return new Response(
                JSON.stringify({ message: 'Missing klarna_order_id in query parameters' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Logga mottaget order_id
        console.log('Order ID från query-param:', orderId);

        // Hämta rå body för debugging (den bör vara tom eller innehålla minimal data)
        const rawBody = await req.text();
        console.log('--- Inkommande Body ---');
        console.log(rawBody || 'Tom body');

        // Hämta orderdetaljer från Klarna API baserat på order_id
        const orderDetails = await getKlarnaOrder(orderId);

        // Logga orderdetaljer (kan användas för vidare bearbetning)
        console.log('--- Orderdetaljer ---');
        console.log(orderDetails); // Här kan du justera för att logga specifika delar av ordern

        // Svara till Klarna omedelbart för att stoppa retry-pushar
        const response = new Response(
            JSON.stringify({ message: 'Push notification received successfully', order_id: orderId }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

        // Bearbeta order asynkront (exempelvis skapa en order i ditt system, acknokera osv.)
        (async () => {
            try {
                console.log('Bearbetar order asynkront...');

                // Här kan du logga eller hantera orderdetaljer som hämtats från Klarna
                console.log(`Order ID: ${orderId}`);
                console.log(`Order Status: ${orderDetails.status}`); // Logga status från Klarna
                // Exempel på att logga shipping information
                if (orderDetails.shipping_address) {
                    console.log(`Shipping Address: ${orderDetails.shipping_address.street_address}`);
                }
                // Skapa order i din egen databas eller system
                // Skicka acknowledgment till Klarna om ordern ska bekräftas.
                // await acknowledgeOrder(orderId); // Implementera denna funktion om du vill acknokera ordern till Klarna
            } catch (error) {
                console.error('Fel vid bearbetning av order:', error);
            }
        })();

        return response; // Skicka svar till Klarna
    } catch (error) {
        console.error('Fel vid hantering av Klarna Push Notification:', error);

        return new Response(
            JSON.stringify({
                message: 'Failed to handle Klarna push notification',
                details: error.message,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

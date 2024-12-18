import nodemailer from 'nodemailer';

// Setup av e-posttransport via Gmail SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Använd 587 för TLS
    secure: false, // false = TLS (STARTTLS), true = SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Skicka notifieringsmail till dig själv om en ny Klarna-order.
 * @param {Object} orderDetails - Detaljer om ordern från Klarna.
 */
export async function sendEmailNotification(orderDetails) {
    const emailContent = `
        Ny order mottagen från Klarna:
        -----------------------------------
        Order ID: ${orderDetails.id}
        Kund: ${orderDetails.customer.name}
        Totalbelopp: ${orderDetails.amount.total} SEK
        Artiklar: ${orderDetails.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}

        Logga in i Klarna Dashboard för mer detaljer.
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER, // Din e-postadress
        to: process.env.EMAIL_USER, // Skicka mejlet till dig själv
        subject: '🔔 Ny Klarna-order mottagen',
        text: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Notifieringsmail skickat.');
    } catch (error) {
        console.error('Fel vid skickande av e-post:', error);
    }
}

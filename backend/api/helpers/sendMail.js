/**
 * sendMail helper using Brevo (Sendinblue) HTTP API v3
 */
const sendMail = async (to, subject, html) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SMTP_EMAIL;

  console.log(`[MAIL] Sending via Brevo API to: ${to}`);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: {
          name: "ZenCart Store",
          email: senderEmail
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[BREVO API ERROR]', result);
      // Throw the specific message from Brevo
      throw new Error(result.message || JSON.stringify(result));
    }

    console.log(`[MAIL SUCCESS] Message ID: ${result.messageId}`);
    return result;
  } catch (err) {
    console.error(`[MAIL ERROR]`, err.message);
    
    if (err.message.includes('unauthorized') || err.message.includes('key')) {
      throw new Error('Invalid Brevo API Key. Please double check BREVO_API_KEY in your .env');
    } else if (err.message.includes('sender')) {
      throw new Error(`Sender email "${senderEmail}" is not verified in your Brevo account. Go to "Senders & IP" in Brevo and verify it.`);
    }
    
    throw new Error(`Brevo API Error: ${err.message}`);
  }
};

module.exports = sendMail;

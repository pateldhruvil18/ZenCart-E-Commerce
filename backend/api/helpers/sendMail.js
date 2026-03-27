const sendMail = async (to, subject, html) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: 'E-Commerce Store',
          email: process.env.SMTP_EMAIL || 'your_verified_email@gmail.com'
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });
    
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo API error: ${errorData}`);
    }
    
    const data = await response.json();
    console.log(`[MAIL SENT] To: ${to} | MessageId: ${data.messageId}`);
    return data;
  } catch (err) {
    console.error(`[MAIL ERROR] Failed to send to ${to}:`, err.message);
    throw err;
  }
};

module.exports = sendMail;

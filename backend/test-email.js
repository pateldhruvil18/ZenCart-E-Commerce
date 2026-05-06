require('dotenv').config();
const sendMail = require('./api/helpers/sendMail');

const testEmail = async () => {
  const recipient = process.env.SMTP_EMAIL;
  console.log(`[TEST] Attempting to send Brevo SMTP test email to: ${recipient}...`);
  
  if (!process.env.BREVO_API_KEY || !process.env.SMTP_EMAIL) {
    console.error('[TEST] ❌ Missing BREVO_API_KEY or SMTP_EMAIL in .env file.');
    return;
  }

  try {
    await sendMail(
      recipient,
      'Brevo SMTP Test - E-Commerce Store',
      '<h1>Brevo SMTP Working!</h1><p>This email confirms that your Brevo SMTP relay is configured correctly for production.</p>'
    );
    console.log('[TEST] ✅ Success! Brevo SMTP is working.');
  } catch (err) {
    console.error('[TEST] ❌ Email Failed.');
    console.error('[TEST] Error Message:', err.message);
    
    console.log('\n--- Troubleshooting Steps ---');
    console.log('1. Go to your Brevo Dashboard -> Senders & IP.');
    console.log(`2. Ensure "${process.env.SMTP_EMAIL}" is listed as a "Verified" sender.`);
    console.log('3. Go to SMTP & API -> SMTP Tab.');
    console.log('4. Ensure "SMTP Relay" is enabled (it is usually enabled by default).');
  }
};

testEmail();

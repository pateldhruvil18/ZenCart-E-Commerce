const twilio = require('twilio');

/**
 * Send an SMS message using Twilio
 * @param {string} phone - The recipient's phone number
 * @param {string} message - The SMS body content
 */
const sendSMS = async (phone, message) => {
  try {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE;

    if (!accountSid || !authToken || !twilioPhone) {
      console.warn('Twilio credentials are not configured. Skipping SMS notification.');
      return;
    }

    const client = twilio(accountSid, authToken);

    // Make sure the phone number is fully formatted with a country code,
    // e.g. +91 if Indian, etc. If it's missing, you may want to format it.
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      // Assuming India +91 as default for this e-commerce logic, but better to enforce
      // at the validation level. We'll format just in case it's 10 digits.
      if (formattedPhone.length === 10) {
        formattedPhone = `+91${formattedPhone}`;
      }
    }

    const response = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedPhone,
    });

    console.log(`[SMS Success] Sent to ${formattedPhone}, SID: ${response.sid}`);
    return response;
  } catch (error) {
    // We catch the error here so that it does NOT crash the calling function
    // and ruin the order placement process for the user.
    console.error(`[SMS Error] Failed to send SMS to ${phone}:`, error.message);
  }
};

module.exports = sendSMS;

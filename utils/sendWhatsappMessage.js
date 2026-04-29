import client from "../config/twilio.js";

const sendWhatsMessage = async (to, body) => {
  try {
    const response = await client.message.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp: +91${to}`,
      body,
    });

    console.log("Whatsapp message sent", response.sid);

    return response;
  } catch (error) {
    console.log("Error while sending message", error.message);
  }
};

export default sendWhatsMessage;

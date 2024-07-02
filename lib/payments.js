import axios from 'axios';
import { Buffer } from 'buffer';

const M_PESA_BASE_URL = 'https://sandbox.safaricom.co.ke'; // Use the production URL in a live environment
const CONSUMER_KEY = 'cpUgid3dXHAA8be65DNBDMZSVtieagAQHqG4uizxAcpwtl1V';
const CONSUMER_SECRET = '6OB1cqVJ9xilzV9dDRSfsUyUEDt1AFxZcQJzkuvsGKagaFrYYdZIAbSTXD6zlEmx';
const SHORTCODE = '174379';
const PASSKEY = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const CALLBACK_URL = 'https://webhook.site/311e8a2c-bdb2-4427-8925-992b6e21c544/callback'; // Ensure this URL is accessible and handles the callback

const auth = async () => {
  const buffer = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get(`${M_PESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${buffer}`,
    },
  });

  return response.data.access_token;
};
export const initiatePayment = async (phoneNumber, totalAmount) => {
  try {
    const accessToken = await auth();
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, -5);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    const response = await axios.post(
      `${M_PESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        "BusinessShortCode": 174379,
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwNjI5MTAzNDUz",
        "Timestamp": "20240629103453",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": parseInt(totalAmount)+1,
        "PartyA": parseInt(phoneNumber),
        "PartyB": 174379,
        "PhoneNumber": parseInt(phoneNumber),
        "CallBackURL": "https://webhook.site/18d20512-504b-4f3/callback0-8299-188c5290d608/callback",
        "AccountReference": "SBP TREKS LTD",
        "TransactionDesc": "SBP Treks" 
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error);
    throw error;
  }
};

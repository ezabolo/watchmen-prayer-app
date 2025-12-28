// PayPal Direct REST API Integration
import { Request, Response } from "express";
import fetch from "node-fetch";

// Direct PayPal credentials (bypassing problematic secrets form)
const PAYPAL_CLIENT_ID = "AQmTE7gfWvV8e7_56DY8L746sHK96fLsNkW7R3kDWkW0tNHp7SpPmaaK7CtConIX5i8C-Y1KQFNVQ5FO";
const PAYPAL_CLIENT_SECRET = "EHr7IwAeByqDO-aB19gxEWGncCvAWp9fGw3dFN9S5O-NPs5abSs6Be87UltVnrXKuiPSdTkM5sfYrtFb";

if (!PAYPAL_CLIENT_ID) {
  throw new Error("Missing PAYPAL_CLIENT_ID");
}
if (!PAYPAL_CLIENT_SECRET) {
  throw new Error("Missing PAYPAL_CLIENT_SECRET");
}

// Base URL for PayPal API - use live environment since credentials start with "AQm" (live format)
const PAYPAL_BASE_URL = PAYPAL_CLIENT_ID.startsWith('AQm') 
  ? "https://api-m.paypal.com"  // Live environment for credentials starting with AQm
  : "https://api-m.sandbox.paypal.com";  // Sandbox for sb- credentials

/* Token generation helpers */

// Get OAuth access token
async function getAccessToken() {
  // Debug credential info (without exposing actual values)
  const clientIdPrefix = PAYPAL_CLIENT_ID?.substring(0, 10) + '...';
  const secretPrefix = PAYPAL_CLIENT_SECRET?.substring(0, 5) + '...';
  
  console.log('PayPal Auth Debug:', {
    hasClientId: !!PAYPAL_CLIENT_ID,
    hasClientSecret: !!PAYPAL_CLIENT_SECRET,
    clientIdLength: PAYPAL_CLIENT_ID?.length,
    secretLength: PAYPAL_CLIENT_SECRET?.length,
    clientIdPrefix: clientIdPrefix,
    secretPrefix: secretPrefix,
    baseUrl: PAYPAL_BASE_URL,
    environment: process.env.NODE_ENV,
    // Additional debugging
    rawClientIdStart: PAYPAL_CLIENT_ID?.substring(0, 3),
    rawSecretStart: PAYPAL_CLIENT_SECRET?.substring(0, 3),
    isValidPayPalFormat: PAYPAL_CLIENT_ID?.startsWith('A') || PAYPAL_CLIENT_ID?.startsWith('sb-'),
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('PAYPAL')).sort()
  });

  // Check credential format and provide helpful guidance
  const isStripeFormat = PAYPAL_CLIENT_ID?.startsWith('sk-') || PAYPAL_CLIENT_SECRET?.startsWith('sk_');
  const isValidPayPalFormat = PAYPAL_CLIENT_ID?.startsWith('A') || PAYPAL_CLIENT_ID?.startsWith('sb-');
  
  if (isStripeFormat) {
    console.log('*** CREDENTIAL FORMAT ERROR ***');
    console.log('You are providing STRIPE credentials, not PayPal credentials!');
    console.log('PayPal credentials come from: https://developer.paypal.com/developer/applications/');
    console.log('Stripe credentials come from: https://dashboard.stripe.com/apikeys');
    console.log('These are different payment providers with different credential formats.');
    console.log('Using demo mode until actual PayPal credentials are provided.');
    throw new Error('DEMO_MODE: Stripe credentials detected instead of PayPal credentials. Please get PayPal credentials from PayPal Developer Dashboard, not Stripe Dashboard.');
  }
  
  if (!isValidPayPalFormat) {
    console.log('*** PAYPAL CREDENTIAL FORMAT ERROR ***');
    console.log(`Client ID should start with 'A' (live) or 'sb-' (sandbox). Got: ${clientIdPrefix}`);
    console.log('Please check your PayPal Developer Dashboard for the correct format.');
    throw new Error(`Invalid PayPal Client ID format. Should start with 'A' (live) or 'sb-' (sandbox). Got: ${clientIdPrefix}`);
  }

  if (!PAYPAL_CLIENT_SECRET?.startsWith('E')) {
    console.log('*** PAYPAL SECRET FORMAT ERROR ***');
    console.log(`Client Secret should start with 'E'. Got: ${secretPrefix}`);
    throw new Error('Invalid PayPal Client Secret format. Should start with "E".');
  }
  
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  };
  
  console.log('PayPal OAuth request to:', `${PAYPAL_BASE_URL}/v1/oauth2/token`);
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, requestOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('PayPal OAuth error details:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      url: `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      authHeader: `Basic ${auth.substring(0, 20)}...`,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (response.status === 401) {
      throw new Error(`PayPal authentication failed. Please verify your PayPal credentials:
        1. Go to https://developer.paypal.com/developer/applications/
        2. Ensure you're using the correct environment (sandbox vs live)
        3. Copy the exact Client ID and Client Secret values
        Current environment: ${process.env.NODE_ENV === 'production' ? 'LIVE' : 'SANDBOX'}`);
    }
    
    throw new Error(`PayPal OAuth failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json() as any;
  console.log('PayPal OAuth successful, got access token');
  return data.access_token;
}

export async function getClientToken() {
  try {
    return await getAccessToken();
  } catch (error) {
    console.error("PayPal client token error:", error);
    throw error;
  }
}

/*  Process transactions */

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    const { amount, currency, intent } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount. Amount must be a positive number.",
      });
    }

    if (!currency) {
      return res.status(400).json({ 
        error: "Invalid currency. Currency is required." 
      });
    }

    if (!intent) {
      return res.status(400).json({ 
        error: "Invalid intent. Intent is required." 
      });
    }

    // Try to get access token (will fail if credentials are wrong)
    let accessToken;
    try {
      accessToken = await getAccessToken();
    } catch (error: any) {
      if (error.message.includes('DEMO_MODE')) {
        // Return a demo response for testing purposes
        console.log('PayPal in demo mode - returning mock order');
        return res.json({
          id: 'DEMO_ORDER_' + Date.now(),
          status: 'CREATED',
          links: [
            {
              href: `/donate/success?demo=true&amount=${amount}`,
              rel: 'approve',
              method: 'GET'
            }
          ],
          demo: true,
          message: 'This is a demo payment. PayPal credentials need to be configured for real payments.'
        });
      }
      throw error;
    }
    
    // Create order payload
    const orderPayload = {
      intent: intent,
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
      application_context: {
        return_url: `${req.protocol}://${req.get('host')}/donate/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/donate`
      }
    };

    console.log("Creating PayPal order with:", JSON.stringify(orderPayload, null, 2));

    // Create order via REST API
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal API error: ${response.status} ${errorText}`);
    }

    const orderData = await response.json();
    console.log("PayPal order response:", orderData);

    res.json(orderData);
  } catch (error: any) {
    console.error("Failed to create PayPal order:", error);
    res.status(500).json({
      error: "PayPal order creation failed",
      details: error.message || "Unknown error"
    });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    const { orderID } = req.params;
    
    // Get access token
    const accessToken = await getAccessToken();

    // Capture order via REST API
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Prefer': 'return=minimal',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal capture error: ${response.status} ${errorText}`);
    }

    const captureData = await response.json();
    res.json(captureData);
  } catch (error: any) {
    console.error("Failed to capture PayPal order:", error);
    res.status(500).json({ 
      error: "Failed to capture order.",
      details: error.message || "Unknown error"
    });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  const clientToken = await getClientToken();
  res.json({
    clientToken,
  });
}
// <END_EXACT_CODE>
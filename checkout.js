// iSuite Office Payment Integration
// Wired to Supabase Edge Functions

const SUPABASE_URL = 'https://nfwcquwoyaeqgekncmyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5md2NxdXdveWFlcWdla25jbXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODYwNDIsImV4cCI6MjA5NzQ2MjA0Mn0._nY420m1fbyfK1hlF-BBYQ2dMjHcvtJjHG2w00NnCLM';

// Products
const PRODUCTS = {
  bundle: {
    name: 'iSuite Bundle (IVOZ + iOrganize + iMonitor)',
    price: 89.00,
    currency: 'USD'
  }
};

/**
 * Initiate PayPal checkout
 * Calls Supabase edge function: create-preference (PayPal)
 */
async function payWithPayPal(productKey = 'bundle') {
  const product = PRODUCTS[productKey];

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-preference-paypal`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: product.price,
        currency: product.currency,
        description: product.name,
        product_id: productKey
      })
    });

    const data = await response.json();

    if (data.approval_url) {
      window.location.href = data.approval_url;
    } else if (data.error) {
      alert('Payment setup failed: ' + data.error);
    }
  } catch (error) {
    console.error('PayPal error:', error);
    alert('Unable to connect to payment processor. Please try again.');
  }
}

/**
 * Initiate Mercado Pago checkout
 * Calls Supabase edge function: create-preference (Mercado Pago)
 */
async function payWithMercadoPago(productKey = 'bundle') {
  const product = PRODUCTS[productKey];

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-preference`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          title: product.name,
          quantity: 1,
          unit_price: product.price,
          currency_id: 'USD'
        }],
        product_id: productKey
      })
    });

    const data = await response.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else if (data.error) {
      alert('Payment setup failed: ' + data.error);
    }
  } catch (error) {
    console.error('Mercado Pago error:', error);
    alert('Unable to connect to payment processor. Please try again.');
  }
}

// Export for use in HTML
window.payWithPayPal = payWithPayPal;
window.payWithMercadoPago = payWithMercadoPago;

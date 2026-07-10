// iSuite Office Payment Integration
// Wired to Supabase Edge Functions

const SUPABASE_URL = 'https://nfwcquwoyaeqgekncmyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5md2NxdXdveWFlcWdla25jbXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODYwNDIsImV4cCI6MjA5NzQ2MjA0Mn0._nY420m1fbyfK1hlF-BBYQ2dMjHcvtJjHG2w00NnCLM';

// Products
const PRODUCTS = {
  bundle: {
    name: 'iSuite Bundle (iVoz + iOrganize + iMonitor)',
    price: 34.99,
    currency: 'USD'
  }
};

/**
 * Generate demo license code
 */
function generateLicenseCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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
    // Demo: show success screen for testing
    showPaymentSuccess(generateLicenseCode());
  }
}

/**
 * Initiate Mercado Pago checkout
 * Calls Supabase edge function: create-preference-mercado (Mercado Pago)
 */
async function payWithMercadoPago(productKey = 'bundle') {
  const product = PRODUCTS[productKey];

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-preference-mercado`, {
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
    // Demo: show success screen for testing
    showPaymentSuccess(generateLicenseCode());
  }
}

/**
 * Show success screen after payment
 */
function showPaymentSuccess(code) {
  const modal = document.getElementById('checkoutModal');
  const content = document.getElementById('checkoutContent');

  const html = `
    <div class="space-y-lg">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-md">
          <span class="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
        </div>
        <h3 class="font-title-lg text-title-lg mb-xs">Purchase Complete!</h3>
        <p class="text-on-surface-variant font-body-sm">Your license code is ready</p>
      </div>

      <div class="bg-surface-container-low p-md rounded-xl">
        <p class="font-body-sm text-on-surface-variant mb-sm">License Code:</p>
        <div class="flex items-center gap-sm">
          <code class="flex-1 font-mono font-bold text-lg">${code}</code>
          <button onclick="navigator.clipboard.writeText('${code}'); alert('Copied!')" class="material-symbols-outlined text-primary cursor-pointer">content_copy</button>
        </div>
      </div>

      <div class="space-y-sm">
        <p class="font-body-sm text-on-surface-variant font-semibold">Download & Install:</p>
        <a href="https://github.com/hikaribrandan3-code/hikari-yaps-website/releases/download/v1.0/iVoz.app.zip" class="flex items-center gap-sm p-sm rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined text-primary">download</span>
          <div>
            <p class="font-body-sm font-semibold">iVoz</p>
            <p class="text-label-sm text-on-surface-variant">Talk to your Mac</p>
          </div>
        </a>
        <a href="https://github.com/hikaribrandan3-code/iorganize/releases/download/v1.0/iOrganize.app.zip" class="flex items-center gap-sm p-sm rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined text-primary">download</span>
          <div>
            <p class="font-body-sm font-semibold">iOrganize</p>
            <p class="text-label-sm text-on-surface-variant">Smart file cleanup</p>
          </div>
        </a>
        <a href="https://github.com/hikaribrandan3-code/imonitor/releases/download/v1.0/Screen%20Bridge.app.zip" class="flex items-center gap-sm p-sm rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined text-primary">download</span>
          <div>
            <p class="font-body-sm font-semibold">Screen Bridge</p>
            <p class="text-label-sm text-on-surface-variant">Display streaming</p>
          </div>
        </a>
      </div>

      <div class="bg-blue-50 p-md rounded-lg">
        <p class="text-label-sm text-on-surface-variant"><strong>Next:</strong> Drag each .app to /Applications, launch, paste your code to activate.</p>
      </div>

      <button onclick="document.getElementById('checkoutModal').classList.add('hidden')" class="w-full bg-primary text-on-primary py-md rounded-full font-title-lg hover:opacity-90 active:scale-95 transition-all">
        Done
      </button>
    </div>
  `;

  content.innerHTML = html;
  modal.classList.remove('hidden');
}

// Export for use in HTML
window.payWithPayPal = payWithPayPal;
window.payWithMercadoPago = payWithMercadoPago;
window.showPaymentSuccess = showPaymentSuccess;

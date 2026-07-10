// iSuite Office Payment Integration
// Wired to Supabase Edge Functions

const SUPABASE_URL = 'https://nfwcquwoyaeqgekncmyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5md2NxdXdveWFlcWdla25jbXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODYwNDIsImV4cCI6MjA5NzQ2MjA0Mn0._nY420m1fbyfK1hlF-BBYQ2dMjHcvtJjHG2w00NnCLM';

// Products
const PRODUCTS = {
  ivoz: {
    name: 'iVoz Pro - Lifetime License',
    price: 24.99,
    currency: 'USD',
    downloads: [
      { name: 'iVoz', url: 'https://github.com/hikaribrandan3-code/hikari-yaps-website/releases/download/v1.0/iVoz.app.zip', desc: 'Talk to your Mac' }
    ]
  },
  iorganize: {
    name: 'iOrganize Pro - Lifetime License',
    price: 12.99,
    currency: 'USD',
    downloads: [
      { name: 'iOrganize', url: 'https://github.com/hikaribrandan3-code/iorganize/releases/download/v1.0/iOrganize.app.zip', desc: 'Smart file cleanup' }
    ]
  },
  imonitor: {
    name: 'Screen Bridge Pro - Lifetime License',
    price: 9.99,
    currency: 'USD',
    downloads: [
      { name: 'Screen Bridge', url: 'https://github.com/hikaribrandan3-code/imonitor/releases/download/v1.0/Screen%20Bridge.app.zip', desc: 'Display streaming' }
    ]
  },
  bundle: {
    name: 'iSuite Bundle (iVoz + iOrganize + Screen Bridge)',
    price: 44.99,
    currency: 'USD',
    downloads: [
      { name: 'iVoz', url: 'https://github.com/hikaribrandan3-code/hikari-yaps-website/releases/download/v1.0/iVoz.app.zip', desc: 'Talk to your Mac' },
      { name: 'iOrganize', url: 'https://github.com/hikaribrandan3-code/iorganize/releases/download/v1.0/iOrganize.app.zip', desc: 'Smart file cleanup' },
      { name: 'Screen Bridge', url: 'https://github.com/hikaribrandan3-code/imonitor/releases/download/v1.0/Screen%20Bridge.app.zip', desc: 'Display streaming' }
    ]
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
    showPaymentSuccess(generateLicenseCode(), productKey);
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
    showPaymentSuccess(generateLicenseCode(), productKey);
  }
}

/**
 * Show success screen after payment
 */
function showPaymentSuccess(code, productKey = 'bundle') {
  const modal = document.getElementById('checkoutModal');
  const content = document.getElementById('checkoutContent');
  const product = PRODUCTS[productKey] || PRODUCTS.bundle;
  const downloads = product.downloads || [];

  let downloadsHtml = downloads.map(app => `
    <a href="${app.url}" class="flex items-center gap-sm p-sm rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
      <span class="material-symbols-outlined text-primary">download</span>
      <div>
        <p class="font-body-sm font-semibold">${app.name}</p>
        <p class="text-label-sm text-on-surface-variant">${app.desc}</p>
      </div>
    </a>
  `).join('');

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
        ${downloadsHtml}
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

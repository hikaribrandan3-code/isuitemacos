// App catalog with details
const apps = {
    ivoz: {
        name: 'IVOZ',
        tagline: 'Dictation & Voice Control',
        price: 4.99,
        description: 'Local AI-powered dictation. Transcribe your voice in real-time, no internet required.',
        details: `
            <h3>IVOZ — Local Voice Transcription</h3>
            <p>Dictation, reinvented. IVOZ brings professional-grade voice recognition to your Mac without leaving the device.</p>
            <h4>Features</h4>
            <ul>
                <li>Real-time transcription with instant accuracy</li>
                <li>100% local processing — no cloud, no data sent</li>
                <li>Multi-language support</li>
                <li>Menu bar access — transcribe anywhere</li>
                <li>Keyboard shortcuts for quick access</li>
                <li>Custom vocabulary training</li>
            </ul>
            <h4>System Requirements</h4>
            <ul>
                <li>macOS 13 or later</li>
                <li>Microphone access</li>
                <li>100MB free disk space</li>
            </ul>
        `,
        downloadUrl: 'https://documents.example.com/HikariYaps.zip'
    },
    iorganize: {
        name: 'iOrganize',
        tagline: 'Smart File Cleanup',
        price: 7.99,
        description: 'Intelligent duplicate finder and disk cleaner. Reclaim space without the bloat.',
        details: `
            <h3>iOrganize — The Cleanup Genius</h3>
            <p>Stop manual cleanup. iOrganize finds duplicates, large files, and clutter automatically — then removes them safely.</p>
            <h4>Features</h4>
            <ul>
                <li>AI-powered duplicate detection</li>
                <li>Deep disk analysis and visualization</li>
                <li>One-click cleanup with safety undo</li>
                <li>Auto-cleanup rules (optional)</li>
                <li>Excludes system files — 100% safe</li>
                <li>Reclaim GB of space instantly</li>
            </ul>
            <h4>System Requirements</h4>
            <ul>
                <li>macOS 13 or later</li>
                <li>500MB free disk space</li>
                <li>Intel or Apple Silicon Mac</li>
            </ul>
        `,
        downloadUrl: 'https://documents.example.com/iOrganize.zip'
    },
    imonitor: {
        name: 'iMonitor',
        tagline: 'Extended Display for Any Device',
        price: 9.99,
        description: 'Turn any tablet or TV into a true extended monitor. No cables, instant setup.',
        details: `
            <h3>iMonitor — Your Desk, Everywhere</h3>
            <p>Say goodbye to cables and setup complexity. iMonitor turns any tablet or TV into a real extended display in seconds.</p>
            <h4>Features</h4>
            <ul>
                <li>Works with iPad, Android tablets, and Smart TVs</li>
                <li>Ultra-low latency — feels native</li>
                <li>Full bidirectional input — mouse, keyboard, scroll</li>
                <li>System audio streaming (Mac speakers → tablet)</li>
                <li>No installation on receiver device — just open a browser</li>
                <li>WiFi or USB tethering support</li>
                <li>Drag windows freely between displays</li>
            </ul>
            <h4>System Requirements</h4>
            <ul>
                <li>Mac: macOS 13 or later</li>
                <li>Receiver: Any device with a modern browser</li>
                <li>Stable WiFi connection or USB cable</li>
            </ul>
        `,
        downloadUrl: 'https://documents.example.com/iMonitor.zip'
    }
};

// Checkout cart
let cart = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupFAQ();
});

function setupEventListeners() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when link clicked
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Modal close on outside click
    document.getElementById('appModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'appModal') closeAppModal();
    });
    document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'checkoutModal') closeCheckout();
    });
}

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            // Close others
            faqItems.forEach(i => i.classList.remove('active'));
            // Open this one
            item.classList.add('active');
        });
    });
}

// App modal functions
function openAppModal(appKey) {
    const app = apps[appKey];
    if (!app) return;

    const modal = document.getElementById('appModal');
    const body = document.getElementById('modalBody');

    body.innerHTML = app.details;
    modal.classList.add('active');
}

function closeAppModal() {
    document.getElementById('appModal').classList.remove('active');
}

// Checkout functions
function startCheckout(type) {
    cart = [];

    if (type === 'bundle') {
        cart.push('ivoz', 'iorganize', 'imonitor');
    } else {
        cart.push(type);
    }

    showCheckout();
}

function showCheckout() {
    const modal = document.getElementById('checkoutModal');
    const content = document.getElementById('checkoutContent');

    let html = '<div class="checkout-items">';
    let total = 0;

    cart.forEach(appKey => {
        const app = apps[appKey];
        if (app) {
            html += `
                <div class="checkout-item">
                    <div class="checkout-item-name">${app.name}</div>
                    <div class="checkout-item-price">$${app.price.toFixed(2)}</div>
                </div>
            `;
            total += app.price;
        }
    });

    html += '</div>';

    // Bundle discount
    if (cart.length === 3) {
        total = 19.99; // Bundle price
        html += '<p style="text-align: center; color: #10b981; font-weight: 600; margin: 1rem 0;">✓ Bundle discount applied!</p>';
    }

    html += `
        <div class="checkout-total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>

        <div class="checkout-methods">
            <button class="payment-btn" onclick="processPayment('paypal', ${total})">
                💙 PayPal
            </button>
            <button class="payment-btn" onclick="processPayment('mercado', ${total})">
                🟡 Mercado Pago
            </button>
        </div>

        <p style="font-size: 0.85rem; color: #6b7280; text-align: center; margin-top: 1rem;">
            One-time purchase. 30-day money-back guarantee.
        </p>
    `;

    content.innerHTML = html;
    modal.classList.add('active');
}

function processPayment(method, amount) {
    // Placeholder for payment processing
    // Will integrate with Supabase edge functions

    console.log(`Processing ${method} payment for $${amount}`);
    console.log('Cart:', cart);

    // Show loading state
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '⏳ Processing...';
    btn.disabled = true;

    // Simulate API call to Supabase edge function
    setTimeout(() => {
        alert(`Payment setup: ${method.toUpperCase()} for $${amount}\n\nRedirect to ${method === 'paypal' ? 'PayPal' : 'Mercado Pago'} will be implemented with edge functions.`);
        btn.textContent = originalText;
        btn.disabled = false;
        closeCheckout();
    }, 1500);
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    cart = [];
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

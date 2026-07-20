// ========================
// لیست محصولات (۴ محصول)
// ========================
const products = [
    { id: 1, name: 'هدفون بی‌سیم سونی', price: 350000, image: '🎧', description: 'کیفیت صدای عالی' },
    { id: 2, name: 'کیف چرمی دستساز', price: 280000, image: '👝', description: 'چرم طبیعی مرغوب' },
    { id: 3, name: 'ساعت هوشمند اپل', price: 850000, image: '⌚', description: 'نسخه ۹ سری' },
    { id: 4, name: 'کتاب خودت باش', price: 45000, image: '📚', description: 'بهترین کتاب انگیزشی سال' }
];

// ========================
// مدیریت سبد خرید با localStorage
// ========================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function getProductById(id) {
    return products.find(p => p.id === id);
}

// ========================
// افزودن به سبد خرید
// ========================
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    saveCart();
    showNotification('✅ محصول به سبد خرید اضافه شد!');
}

// ========================
// حذف از سبد خرید
// ========================
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCart();
        renderCart();
    }
}

// ========================
// رندر کردن سبد خرید
// ========================
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:30px;">🛒 سبد خرید شما خالی است</p>';
        if (totalEl) totalEl.textContent = '۰';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.id);
        if (!product) return;
        const subtotal = product.price * item.qty;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <span style="font-size:30px;">${product.image}</span>
                    <div>
                        <div class="item-name">${product.name}</div>
                        <div class="item-price">${subtotal.toLocaleString()} تومان</div>
                    </div>
                </div>
                <div class="item-qty">
                    <button onclick="changeQty(${product.id}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${product.id}, 1)">+</button>
                    <button class="btn-remove" onclick="removeFromCart(${product.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    if (totalEl) totalEl.textContent = total.toLocaleString();
    
    // دکمه پرداخت
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) {
                alert('سبد خرید شما خالی است!');
                return;
            }
            // ذخیره مبلغ برای صفحه پرداخت
            localStorage.setItem('payAmount', total);
            window.location.href = 'payment.html';
        };
    }
}

// ========================
// رندر کردن محصولات در صفحه shop.html
// ========================
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    let html = '';
    products.forEach(p => {
        html += `
            <div class="product-card">
                <div style="font-size:60px;padding:20px 0;">${p.image}</div>
                <h3>${p.name}</h3>
                <p style="color:#7f8c8d;font-size:14px;">${p.description}</p>
                <div class="price">${p.price.toLocaleString()} تومان</div>
                <button class="btn-add" onclick="addToCart(${p.id})">➕ افزودن به سبد</button>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// ========================
// نوتیفیکیشن ساده
// ========================
function showNotification(msg) {
    const div = document.createElement('div');
    div.style.cssText = `
        position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
        background:#2c3e50; color:#fff; padding:15px 30px;
        border-radius:10px; font-size:16px; z-index:999;
        box-shadow:0 4px 15px rgba(0,0,0,0.3);
        animation: slideUp 0.5s ease;
    `;
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2500);
}

// ========================
// اجرای توابع در صفحات مختلف
// ========================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderProducts();
    renderCart();
    
    // دکمه پرداخت در cart.html
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) {
                alert('سبد خرید شما خالی است!');
                return;
            }
            const total = cart.reduce((sum, item) => {
                const p = getProductById(item.id);
                return sum + (p ? p.price * item.qty : 0);
            }, 0);
            localStorage.setItem('payAmount', total);
            window.location.href = 'payment.html';
        };
    }
});

// استایل انیمیشن برای نوتیفیکیشن
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);

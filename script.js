// ========================
// لیست محصولات (۴ محصول)
// ========================
const products = [
    { 
        id: 1, 
        name: 'هدفون بی‌سیم سونی', 
        price: 350000, 
        image: '🎧', 
        description: 'کیفیت صدای فراگیر با نویزکنندگی فعال',
        badge: 'پرفروش'
    },
    { 
        id: 2, 
        name: 'کیف چرمی دستساز', 
        price: 280000, 
        image: '👝', 
        description: 'چرم طبیعی مرغوب با دوخت نفیس',
        badge: 'ویژه'
    },
    { 
        id: 3, 
        name: 'ساعت هوشمند اپل', 
        price: 850000, 
        image: '⌚', 
        description: 'نسخه ۹ سری با صفحه‌ای خیره‌کننده',
        badge: 'جدید'
    },
    { 
        id: 4, 
        name: 'کتاب خودت باش', 
        price: 45000, 
        image: '📚', 
        description: 'بهترین کتاب انگیزشی سال ۲۰۲۴',
        badge: 'تخفیف'
    }
];

// ========================
// مدیریت سبد خرید
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
// نوتیفیکیشن پیشرفته
// ========================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.textContent = message;
    document.body.appendChild(div);
    
    // نمایش با انیمیشن
    requestAnimationFrame(() => {
        div.classList.add('show');
    });
    
    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 500);
    }, 3000);
}

// ========================
// افزودن به سبد خرید با انیمیشن
// ========================
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
        showNotification(`📦 ${getProductById(productId).name} (${existing.qty} عدد)`, 'success');
    } else {
        cart.push({ id: productId, qty: 1 });
        showNotification(`✨ ${getProductById(productId).name} به سبد اضافه شد!`, 'success');
    }
    saveCart();
}

// ========================
// حذف از سبد خرید
// ========================
function removeFromCart(productId) {
    const product = getProductById(productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    showNotification(`🗑️ ${product.name} از سبد حذف شد`, 'error');
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
// رندر سبد خرید
// ========================
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-price');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <div style="font-size:80px;margin-bottom:20px;">🛒</div>
                <h3 style="color:var(--gray);">سبد خرید شما خالی است</h3>
                <p style="color:var(--light-gray);">برای خرید به صفحه محصولات بروید</p>
                <br>
                <a href="shop.html" class="btn-primary" style="display:inline-block;">مشاهده محصولات</a>
            </div>
        `;
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
                    <span class="item-image">${product.image}</span>
                    <div class="item-details">
                        <div class="item-name">${product.name}</div>
                        <div class="item-price">${subtotal.toLocaleString()} تومان</div>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="qty-control">
                        <button onclick="changeQty(${product.id}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${product.id}, 1)">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${product.id})" title="حذف">✕</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    if (totalEl) totalEl.textContent = total.toLocaleString();
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) {
                showNotification('سبد خرید شما خالی است!', 'error');
                return;
            }
            localStorage.setItem('payAmount', total);
            window.location.href = 'payment.html';
        };
    }
}

// ========================
// رندر محصولات
// ========================
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    let html = '';
    products.forEach(p => {
        html += `
            <div class="product-card">
                ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
                <span class="product-image">${p.image}</span>
                <h3>${p.name}</h3>
                <p class="description">${p.description}</p>
                <div class="price">${p.price.toLocaleString()} <span>تومان</span></div>
                <button class="btn-add" onclick="addToCart(${p.id})">
                    ➕ افزودن به سبد
                </button>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// ========================
// هدر شیشه‌ای با اسکرول
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // اسکرول هدر
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    updateCartCount();
    renderProducts();
    renderCart();
});

// ========================
// اضافه کردن فوتر به همه صفحات
// ========================
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('footer')) {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <div class="social">
                <a href="#">📱</a>
                <a href="#">📧</a>
                <a href="#">💬</a>
                <a href="#">📷</a>
            </div>
            <p>© ۲۰۲۶ فروشگاه چهارفصل - تمامی حقوق محفوظ است</p>
        `;
        document.body.appendChild(footer);
    }
});

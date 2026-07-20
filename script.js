// ========================
// لیست محصولات (۴ محصول مشخص)
// ========================
const products = [
    { 
        id: 1, 
        name: 'فلش مموری ۳۲ گیگ', 
        price: 180000, 
        image: '💾', 
        description: 'سرعت بالا، مناسب برای ذخیره‌سازی عکس و فیلم',
        badge: 'پرفروش'
    },
    { 
        id: 2, 
        name: 'فلش مموری ۶۴ گیگ', 
        price: 290000, 
        image: '💿', 
        description: 'ظرفیت بالا با سرعت فوق‌العاده',
        badge: 'ویژه'
    },
    { 
        id: 3, 
        name: 'قاب عکس ۲۱×۱۶', 
        price: 85000, 
        image: '🖼️', 
        description: 'قاب چوبی با کیفیت، مناسب برای عکس‌های ۶×۴',
        badge: 'جدید'
    },
    { 
        id: 4, 
        name: 'قاب عکس ۲۰×۳۰', 
        price: 120000, 
        image: '🖼️', 
        description: 'قاب مگنتی با طراحی مدرن',
        badge: 'تخفیف'
    }
];

// ========================
// مدیریت سبد خرید
// ========================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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
// نوتیفیکیشن
// ========================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.textContent = message;
    document.body.appendChild(div);
    
    requestAnimationFrame(() => div.classList.add('show'));
    setTimeout(() => {
        div.classList.remove('show');
        setTimeout(() => div.remove(), 500);
    }, 3000);
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
    showNotification(`✅ ${getProductById(productId).name} به سبد اضافه شد!`);
}

// ========================
// حذف از سبد خرید
// ========================
function removeFromCart(productId) {
    const product = getProductById(productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    showNotification(`🗑️ ${product.name} حذف شد`, 'error');
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
                <h3 style="color:var(--gray);">سبد خرید خالی است</h3>
                <p style="color:var(--light-gray);">به صفحه محصولات بروید</p>
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
                    <button class="btn-remove" onclick="removeFromCart(${product.id})">✕</button>
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
                showNotification('سبد خرید خالی است!', 'error');
                return;
            }
            if (!currentUser) {
                showNotification('لطفاً ابتدا وارد شوید!', 'error');
                setTimeout(() => window.location.href = 'login.html', 1500);
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
// سیستم احراز هویت (ثبت‌نام و ورود)
// ========================
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-password-confirm').value;

    if (password !== confirm) {
        showNotification('رمز عبور و تکرار آن مطابقت ندارند!', 'error');
        return;
    }

    if (users.find(u => u.phone === phone)) {
        showNotification('این شماره قبلاً ثبت شده است!', 'error');
        return;
    }

    const newUser = { name, phone, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showNotification('✅ ثبت‌نام با موفقیت انجام شد!');
    setTimeout(() => window.location.href = 'index.html', 1500);
}

function handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const user = users.find(u => 
        (u.phone === identifier || u.email === identifier) && u.password === password
    );

    if (!user) {
        showNotification('اطلاعات وارد شده صحیح نیست!', 'error');
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification('✅ خوش آمدید!');
    setTimeout(() => window.location.href = 'index.html', 1500);
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
    
    // ثبت‌نام
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // ورود
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // نمایش وضعیت کاربر در هدر
    if (currentUser) {
        document.querySelectorAll('.btn-login').forEach(el => {
            el.textContent = `👤 ${currentUser.name}`;
            el.href = 'dashboard.html';
        });
    }
});

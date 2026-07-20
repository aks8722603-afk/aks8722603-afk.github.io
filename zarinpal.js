// ============================================
// 🔐 اتصال به درگاه زرین‌پال (واقعی)
// ============================================

// ⚠️ مهم: مرچنت کد خود را از پنل زرین‌پال وارد کنید
const MERCHANT_ID = 'YOUR_MERCHANT_ID_HERE'; // ← اینجا کد خود را وارد کنید

// آدرس بازگشت از درگاه (بعد از پرداخت)
const CALLBACK_URL = window.location.origin + '/payment-callback.html';

document.addEventListener('DOMContentLoaded', () => {
    const amount = parseInt(localStorage.getItem('payAmount')) || 0;
    document.getElementById('pay-amount').textContent = amount.toLocaleString();
    
    // شماره سفارش تصادفی
    document.getElementById('order-id').textContent = Math.floor(100000 + Math.random() * 900000);
    
    const payBtn = document.getElementById('pay-btn');
    const resultDiv = document.getElementById('payment-result');
    
    payBtn.addEventListener('click', async () => {
        if (amount <= 0) {
            resultDiv.innerHTML = `
                <div style="text-align:center;padding:20px;" class="error">
                    ❌ مبلغ قابل پرداخت نامعتبر است!
                </div>
            `;
            return;
        }

        // نمایش وضعیت در حال پردازش
        resultDiv.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="font-size:40px;">⏳</div>
                <p>در حال اتصال به درگاه زرین‌پال...</p>
            </div>
        `;
        resultDiv.className = '';

        try {
            // ============================================
            // مرحله ۱: درخواست توکن از زرین‌پال
            // ============================================
            const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    merchant_id: MERCHANT_ID,
                    amount: amount,
                    callback_url: CALLBACK_URL,
                    description: `خرید از فروشگاه بردخون عکس - سفارش #${document.getElementById('order-id').textContent}`,
                    metadata: {
                        mobile: currentUser?.phone || '',
                        email: currentUser?.email || '',
                    }
                })
            });

            const data = await response.json();

            if (data.data && data.data.code === 100) {
                // ============================================
                // مرحله ۲: هدایت کاربر به صفحه پرداخت زرین‌پال
                // ============================================
                const authority = data.data.authority;
                // ذخیره authority برای بررسی بعدی
                localStorage.setItem('paymentAuthority', authority);
                localStorage.setItem('paymentAmount', amount);
                
                // هدایت به درگاه زرین‌پال
                window.location.href = `https://www.zarinpal.com/pg/StartPay/${authority}`;
            } else {
                // خطا در دریافت توکن
                resultDiv.innerHTML = `
                    <div style="text-align:center;padding:20px;" class="error">
                        ❌ خطا در اتصال به درگاه پرداخت<br>
                        <small style="color:var(--gray);">کد خطا: ${data.data?.code || 'نامشخص'}</small>
                    </div>
                `;
                resultDiv.className = 'error';
            }
        } catch (error) {
            console.error('Error connecting to Zarinpal:', error);
            resultDiv.innerHTML = `
                <div style="text-align:center;padding:20px;" class="error">
                    ❌ خطا در ارتباط با سرور زرین‌پال<br>
                    <small style="color:var(--gray);">لطفاً دوباره تلاش کنید</small>
                </div>
            `;
            resultDiv.className = 'error';
        }
    });
});

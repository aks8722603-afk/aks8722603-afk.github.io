document.addEventListener('DOMContentLoaded', () => {
    const amount = parseInt(localStorage.getItem('payAmount')) || 0;
    document.getElementById('pay-amount').textContent = amount.toLocaleString();
    
    // شماره سفارش تصادفی
    document.getElementById('order-id').textContent = Math.floor(100000 + Math.random() * 900000);
    
    const payBtn = document.getElementById('pay-btn');
    const resultDiv = document.getElementById('payment-result');
    
    payBtn.addEventListener('click', () => {
        // =====================================================
        // 🚀 اینجا محل اتصال به درگاه واقعی است
        // برای اتصال به زرین‌پال واقعی، این بخش را جایگزین کنید
        // =====================================================
        
        // شبیه‌سازی پرداخت (Sandbox)
        resultDiv.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="font-size:50px;">⏳</div>
                <p>در حال اتصال به درگاه زرین‌پال...</p>
            </div>
        `;
        resultDiv.className = '';
        
        // شبیه‌سازی تاخیر شبکه
        setTimeout(() => {
            // ۹۰٪ احتمال موفقیت برای شبیه‌سازی
            const isSuccess = Math.random() < 0.9;
            
            if (isSuccess) {
                resultDiv.innerHTML = `
                    <div style="text-align:center;padding:20px;">
                        <div style="font-size:60px;">✅</div>
                        <h3>پرداخت با موفقیت انجام شد!</h3>
                        <p>شماره پیگیری: ${Math.floor(100000000 + Math.random() * 900000000)}</p>
                        <p style="color:#7f8c8d;font-size:14px;">ایمیل تأیید برای شما ارسال شد.</p>
                        <br>
                        <a href="index.html" class="btn-primary">بازگشت به صفحه اصلی</a>
                    </div>
                `;
                resultDiv.className = 'success';
                // خالی کردن سبد خرید
                localStorage.removeItem('cart');
                localStorage.removeItem('payAmount');
                // آپدیت شمارنده سبد
                document.querySelectorAll('#cart-count').forEach(el => el.textContent = '0');
            } else {
                resultDiv.innerHTML = `
                    <div style="text-align:center;padding:20px;">
                        <div style="font-size:60px;">❌</div>
                        <h3>پرداخت ناموفق!</h3>
                        <p>خطا در ارتباط با درگاه بانکی</p>
                        <p style="color:#7f8c8d;font-size:14px;">لطفاً دوباره تلاش کنید.</p>
                        <br>
                        <button onclick="location.reload()" class="btn-primary">تلاش مجدد</button>
                    </div>
                `;
                resultDiv.className = 'error';
            }
        }, 2000);
    });
});

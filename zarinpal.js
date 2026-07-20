// ============================================
// 🔐 اتصال به درگاه زرین‌پال (واقعی)
// ============================================

// ⚠️ مهم: مرچنت کد خود را از پنل زرین‌پال وارد کنید
const MERCHANT_ID = '84b2b4e0-e560-48da-92cf-e7a69776d68c';
const CALLBACK_URL = window.location.origin + '/payment-callback.html';

document.addEventListener('DOMContentLoaded', () => {
    const amount = parseInt(localStorage.getItem('payAmount')) || 0;
    document.getElementById('pay-amount').textContent = amount.toLocaleString();
    document.getElementById('order-id').textContent = Math.floor(100000 + Math.random() * 900000);
    
    const payBtn = document.getElementById('pay-btn');
    const resultDiv = document.getElementById('payment-result');
    
    payBtn.addEventListener('click', async () => {
        if (amount <= 0) {
            resultDiv.innerHTML = `<div style="text-align:center;padding:20px;" class="error">❌ مبلغ نامعتبر!</div>`;
            return;
        }

        resultDiv.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="font-size:40px;">⏳</div>
                <p>در حال اتصال به درگاه زرین‌پال...</p>
            </div>
        `;
        resultDiv.className = '';

        try {
            const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    merchant_id: MERCHANT_ID,
                    amount: amount,
                    callback_url: CALLBACK_URL,
                    description: `خرید از بردخون عکس - سفارش #${document.getElementById('order-id').textContent}`,
                    metadata: {
                        mobile: currentUser?.phone || '',
                        email: currentUser?.email || '',
                    }
                })
            });

            const data = await response.json();

            if (data.data && data.data.code === 100) {
                const authority = data.data.authority;
                localStorage.setItem('paymentAuthority', authority);
                localStorage.setItem('paymentAmount', amount);
                window.location.href = `https://www.zarinpal.com/pg/StartPay/${authority}`;
            } else {
                resultDiv.innerHTML = `
                    <div style="text-align:center;padding:20px;" class="error">
                        ❌ خطا در اتصال به درگاه پرداخت<br>
                        <small style="color:var(--gray);">کد خطا: ${data.data?.code || 'نامشخص'}</small>
                    </div>
                `;
                resultDiv.className = 'error';
            }
        } catch (error) {
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
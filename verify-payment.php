<?php
$authority = $_GET['Authority'];
$status = $_GET['Status'];

if ($status == 'OK') {
    // تأیید پرداخت با زرین‌پال
    $data = [
        'MerchantID' => 'YOUR_MERCHANT_ID',
        'Authority' => $authority,
        'Amount' => $_SESSION['amount'] // مبلغ ذخیره‌شده
    ];
    
    // ارسال درخواست به زرین‌پال برای تأیید نهایی
    // ...
    
    if ($result['Status'] == 100) {
        echo "پرداخت موفق! شماره پیگیری: " . $result['RefID'];
        // ثبت سفارش در دیتابیس
    }
}
?>

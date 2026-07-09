<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>سبد خرید | بردخون عکس</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.rtl.min.css" rel="stylesheet">
</head>

<body class="bg-light">

<div class="container mt-5">

<h2 class="mb-4">🛒 سبد خرید</h2>

<table class="table table-bordered bg-white">

<thead class="table-primary">
<tr>
<th>محصول</th>
<th>قیمت</th>
<th>حذف</th>
</tr>
</thead>

<tbody id="cartItems">
</tbody>

</table>

<h4 class="text-danger">
جمع کل:
<span id="total">0</span>
تومان
</h4>

<a href="checkout.html" class="btn btn-success mt-3">
ادامه پرداخت
</a>

<a href="index.html" class="btn btn-secondary mt-3">
بازگشت به فروشگاه
</a>

</div>

<script>

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let tbody = document.getElementById("cartItems");

let total = 0;

function render(){

tbody.innerHTML="";

total=0;

cart.forEach((item,index)=>{

total += item.price;

tbody.innerHTML += `
<tr>

<td>${item.name}</td>

<td>${item.price.toLocaleString()} تومان</td>

<td>

<button class="btn btn-danger btn-sm"
onclick="removeItem(${index})">

حذف

</button>

</td>

</tr>
`;

});

document.getElementById("total").innerHTML =
total.toLocaleString();

}

function removeItem(i){

cart.splice(i,1);

localStorage.setItem("cart",JSON.stringify(cart));

render();

}

render();

</script>

</body>
</html>

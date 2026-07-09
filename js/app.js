let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    document.getElementById("cart-count").innerHTML = cart.length;

    alert("محصول به سبد خرید اضافه شد.");

}

window.onload = function () {

    let count = document.getElementById("cart-count");

    if(count){
        count.innerHTML = cart.length;
    }

}

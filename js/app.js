// ===============================
// Bordekhon Aks
// app.js
// ===============================

// سال جاری در فوتر
const year = new Date().getFullYear();

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = year;
}


// ===============================
// اسکرول نرم
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});


// ===============================
// دکمه بازگشت به بالا
// ===============================

const btn = document.createElement("button");

btn.innerHTML = "↑";

btn.id = "topBtn";

document.body.appendChild(btn);

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        btn.style.display = "block";

    } else {

        btn.style.display = "none";

    }

});

btn.onclick = () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};


// ===============================
// انیمیشن کارت‌ها
// ===============================

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

cards.forEach(card => {

    observer.observe(card);

});


// ===============================
// پایان
// ===============================
const products = [
    { name: "The Everyday Shirt", category: "Women", price: 68, tag: "New in", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=700&q=85" },
    { name: "Pleated Wide Leg", category: "Women", price: 94, tag: "Bestseller", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85" },
    { name: "The Relaxed Chore", category: "Men", price: 118, tag: "New in", image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=85" },
    { name: "Soft Rib Tank", category: "Women", price: 42, tag: "Everyday", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85" },
    { name: "Sunday Knit", category: "Men", price: 86, tag: "New in", image: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=700&q=85" },
    { name: "Canvas Utility Bag", category: "All", price: 58, tag: "Bestseller", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85" },
    { name: "Linen Camp Short", category: "Men", price: 62, tag: "Everyday", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=85" },
    { name: "Bias Midi Dress", category: "Women", price: 128, tag: "New in", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85" }
];

let activeFilter = "All";
let cart = [];
const grid = document.querySelector("#product-grid");
const drawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#drawer-overlay");

function renderProducts() {
    const sort = document.querySelector("#sort-select").value;
    let visible = products.filter(product => activeFilter === "All" || product.category === activeFilter || (activeFilter === "New in" && product.tag === "New in"));
    if (sort === "low") visible.sort((a, b) => a.price - b.price);
    if (sort === "high") visible.sort((a, b) => b.price - a.price);
    grid.innerHTML = visible.map((product, index) => `<article class="product-card" style="animation-delay:${index * 45}ms"><div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-tag">${product.tag}</span><button class="quick-add" data-product="${product.name}" aria-label="Add ${product.name} to bag">+</button></div><div class="product-info"><div><p>${product.name}</p><p class="product-category">${product.category} / Threadline</p></div><p class="price">$${product.price.toFixed(2)}</p></div></article>`).join("");
}

function updateCart() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(element => element.textContent = count);
    document.querySelector("#cart-total").textContent = `$${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`;
    document.querySelector("#cart-items").innerHTML = cart.length ? cart.map(item => `<div class="cart-line"><img src="${item.image}" alt=""><div><h3>${item.name}</h3><p>$${item.price.toFixed(2)} x ${item.quantity}</p><button class="remove-item" data-remove="${item.name}">Remove</button></div><strong>$${(item.price * item.quantity).toFixed(2)}</strong></div>`).join("") : '<p class="empty-cart">Your bag is feeling light.<br>Let\'s change that.</p>';
}

function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }
function openCart() { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); }
function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }

document.addEventListener("click", event => {
    const addButton = event.target.closest(".quick-add");
    if (addButton) { const product = products.find(item => item.name === addButton.dataset.product); const existing = cart.find(item => item.name === product.name); existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 }); updateCart(); showToast(`${product.name} added to your bag`); }
    const removeButton = event.target.closest(".remove-item");
    if (removeButton) { cart = cart.filter(item => item.name !== removeButton.dataset.remove); updateCart(); }
});
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => { activeFilter = button.dataset.filter; document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button)); renderProducts(); }));
document.querySelectorAll("[data-nav-filter]").forEach(link => link.addEventListener("click", () => { activeFilter = link.dataset.navFilter; document.querySelector(`[data-filter="${activeFilter}"]`).click(); }));
document.querySelector("#sort-select").addEventListener("change", renderProducts);
document.querySelector("#cart-button").addEventListener("click", openCart); document.querySelector("#close-cart").addEventListener("click", closeCart); overlay.addEventListener("click", closeCart);
document.querySelector(".menu-toggle").addEventListener("click", () => document.querySelector(".main-nav").classList.toggle("open"));
document.querySelector(".search-toggle").addEventListener("click", () => { document.querySelector("#shop").scrollIntoView(); showToast("Use the collection filters to browse"); });
document.querySelector("#checkout-button").addEventListener("click", () => cart.length ? showToast("Checkout is ready for your order") : showToast("Add a piece before checking out"));
document.querySelector("#newsletter-form").addEventListener("submit", event => { event.preventDefault(); document.querySelector("#newsletter-message").textContent = "You are on the list. Welcome to Threadline."; event.target.reset(); });
renderProducts(); updateCart();
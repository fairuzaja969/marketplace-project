// Mengambil data keranjang dari LocalStorage
let cart = JSON.parse(localStorage.getItem("ada_teknik_cart")) || [];

// Fungsi Tambah Produk ke Keranjang
function addToCart(productId) {
  const productToAdd = products.find(p => p.id === productId);
  if (!productToAdd) return;

  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: productToAdd.id,
      name: productToAdd.name,
      price: productToAdd.price,
      quantity: 1
    });
  }

  saveAndRenderCart();
  alert(`${productToAdd.name} berhasil ditambahkan ke keranjang!`);
}

// Buka/Tutup Modal Keranjang
function toggleCartModal() {
  const overlay = document.getElementById("cartOverlay");
  if (!overlay) return;
  const isVisible = overlay.style.display === "flex";
  overlay.style.display = isVisible ? "none" : "flex";
  renderCart();
}

// Render Item Keranjang
function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalCount = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p style='text-align:center; color:#888;'>Keranjang belanja masih kosong.</p>";
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      totalCount += item.quantity;

      const itemElement = document.createElement("div");
      itemElement.classList.add("cart-item");
      itemElement.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Rp ${item.price.toLocaleString("id-ID")}</p>
        </div>
        <div class="cart-item-qty">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
          <button onclick="removeItem(${index})" style="color:red; margin-left:5px; border:none; background:none; cursor:pointer;">&times;</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  if (cartCount) cartCount.innerText = totalCount;
  if (cartTotal) cartTotal.innerText = `Rp ${total.toLocaleString("id-ID")}`;
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveAndRenderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveAndRenderCart();
}

function saveAndRenderCart() {
  localStorage.setItem("ada_teknik_cart", JSON.stringify(cart));
  renderCart();
}

// Fungsi Checkout
function openCheckoutModal() {
  if (cart.length === 0) {
    alert("Keranjang belanja kamu masih kosong!");
    return;
  }
  toggleCartModal();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const checkoutTotal = document.getElementById("checkoutTotal");
  if (checkoutTotal) checkoutTotal.innerText = `Rp ${total.toLocaleString("id-ID")}`;
  
  document.getElementById("checkoutOverlay").style.display = "flex";
}

function closeCheckoutModal() {
  document.getElementById("checkoutOverlay").style.display = "none";
}

function processCheckout(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;

  alert(`Terima kasih ${name}!\nPesanan produk teknik Anda berhasil dibuat dan siap dikirim ke: ${address}`);

  cart = [];
  localStorage.removeItem("ada_teknik_cart");
  renderCart();
  closeCheckoutModal();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});
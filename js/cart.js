// Mengambil data keranjang dari LocalStorage (jika ada)
let cart = JSON.parse(localStorage.getItem("cartData")) || [];

// 1. Fungsi Tampil / Sembunyi Modal Keranjang
function toggleCartModal() {
  const overlay = document.getElementById("cartOverlay");
  const isVisible = overlay.style.display === "flex";
  overlay.style.display = isVisible ? "none" : "flex";
  renderCart();
}

// 2. Fungsi Memperbarui Tampilan Keranjang
function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalCount = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p style='text-align:center; color:#888;'>Keranjang kamu masih kosong.</p>";
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
          <button onclick="removeItem(${index})" style="color:red; margin-left:5px;">&times;</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  cartCount.innerText = totalCount;
  cartTotal.innerText = `Rp ${total.toLocaleString("id-ID")}`;
  
  // Simpan data keranjang ke LocalStorage
  localStorage.setItem("cartData", JSON.stringify(cart));
}

// 3. Fungsi Tambah/Kurang Jumlah Barang
function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

// 4. Fungsi Hapus Item dari Keranjang
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// 5. Fungsi Membuka Modal Checkout
function openCheckoutModal() {
  if (cart.length === 0) {
    alert("Keranjang kamu masih kosong!");
    return;
  }
  
  toggleCartModal(); // Tutup panel keranjang
  
  // Hitung Total untuk Checkout
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById("checkoutTotal").innerText = `Rp ${total.toLocaleString("id-ID")}`;
  
  document.getElementById("checkoutOverlay").style.display = "flex";
}

// 6. Fungsi Menutup Modal Checkout
function closeCheckoutModal() {
  document.getElementById("checkoutOverlay").style.display = "none";
}

// 7. Fungsi Memproses Formulir Checkout
function processCheckout(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  alert(`Terima kasih ${name}!\nPesanan kamu berhasil dibuat.\n\nAlamat: ${address}\nPembayaran: ${payment}`);

  // Kosongkan Keranjang setelah Checkout Selesai
  cart = [];
  localStorage.removeItem("cartData");
  renderCart();
  closeCheckoutModal();
}

// Jalankan saat pertama kali halaman dimuat untuk menghitung item yang tersimpan
renderCart();
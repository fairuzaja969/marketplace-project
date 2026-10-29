// Data Dummy Produk Teknik untuk Ada Teknik
const products = [
  {
    id: 1,
name: "Mesin Bor Tangan Listrik 13mm",
    category: "elektronik",
    price: 350000,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500"
  },
  {
    id: 2,
    name: "Mesin Las Inverter IGBT 120A",
    category: "elektronik",
    price: 850000,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500"
  },
  {
    id: 3,
    name: "Kunci Pas Set 8-24mm (Chrome Vanadium)",
    category: "pakaian", // Handtools
    price: 185000,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500"
  },
  {
    id: 4,
    name: "Helm Safety Proyek SNI + Tali Dagu",
    category: "aksesoris",
price: 45000,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500"
  }
];
];

// Menampilkan Produk ke Grid
function renderProducts(items) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b;">Produk tidak ditemukan.</p>`;
    return;
  }

  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">Rp ${product.price.toLocaleString("id-ID")}</div>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
        + Keranjang
      </button>
    `;
    grid.appendChild(card);
  });
}

// Fitur Filter & Pencarian
function setupFilters() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  function filterData() {
    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const category = categoryFilter ? categoryFilter.value : "all";

    const filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query);
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", filterData);
  if (categoryFilter) categoryFilter.addEventListener("change", filterData);
}

// Fungsi Tambah Produk ke Keranjang (Terhubung dengan cart.js)
function addToCart(productId) {
  // 1. Cari data produk berdasarkan ID
  const productToAdd = products.find(p => p.id === productId);

  if (!productToAdd) return;

  // 2. Ambil data keranjang dari LocalStorage
  let currentCart = JSON.parse(localStorage.getItem("ada_tesoed_cart")) || [];

  // 3. Cek apakah produk sudah ada di keranjang
  const existingItemIndex = currentCart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    // Jika sudah ada, tambahkan jumlahnya (quantity)
    currentCart[existingItemIndex].quantity += 1;
  } else {
    // Jika belum ada, masukkan produk baru ke keranjang
    currentCart.push({
      id: productToAdd.id,
      name: productToAdd.name,
      price: productToAdd.price,
      quantity: 1
    });
  }

  // 4. Simpan kembali ke LocalStorage
  localStorage.setItem("ada_tesoed_cart", JSON.stringify(currentCart));

  // 5. Perbarui tampilan keranjang jika fungsi renderCart dari cart.js ada
  if (typeof renderCart === 'function') {
    if (typeof cart !== 'undefined') {
      cart = currentCart;
    }
    renderCart();
  }

  alert(`${productToAdd.name} berhasil ditambahkan ke keranjang!`);
}

// Inisialisasi Produk saat Halaman Dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  setupFilters();
});
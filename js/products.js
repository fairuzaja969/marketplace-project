// Data Dummy Produk
const products = [
  {
    id: 1,
    name: "Kertas Folio bergaris 100 lembar",
    category: "",
    price: 30000,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3lsOhcX_t1UFuWfRega9QwXRhKj_o_Zo3MXbkRQ9SrA&s=10"
  },
  {
    id: 2,
    name: "BIMO sama kandang",
    category: "pakaian",
    price: 2000,
    image: "images/bimo.png"
  },
  {
    id: 3,
    name: "Keyboard Mechanical RGB",
    category: "elektronik",
    price: 450000,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 4,
    name: "Topi Snapback Kasual",
    category: "aksesoris",
    price: 50000,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 5,
    name: "BIMO sama kandang",
    category: "pakaian",
    price: 2000,
    image: "images/bimo.png"
  },
];

// Elemen DOM
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Fungsi menampilkan produk ke halaman
function renderProducts(items) {
  productGrid.innerHTML = "";

  if (items.length === 0) {
    productGrid.innerHTML = "<p>Produk tidak ditemukan.</p>";
    return;
  }

  items.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <span class="category">${product.category}</span>
      <h3>${product.name}</h3>
      <div class="price">Rp ${product.price.toLocaleString("id-ID")}</div>
      <button onclick="addToCart(${product.id})">+ Keranjang</button>
    `;

    productGrid.appendChild(card);
  });
}

// Fungsi Filter & Pencarian
function filterProducts() {1saz
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

// Event Listener
searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Jalankan pertama kali saat halaman dimuat
renderProducts(products);

// Simulasi tambah ke keranjang (bisa dihubungkan ke fitur keranjang temanmu nanti)
// Fungsi Tambah Produk ke Keranjang (Terhubung dengan cart.js)
function addToCart(productId) {
  // 1. Cari data produk berdasarkan ID
  const productToAdd = products.find(p => p.id === productId);

  if (!productToAdd) return;

  // 2. Ambil data keranjang dari LocalStorage
  let currentCart = JSON.parse(localStorage.getItem("cartData")) || [];

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
  localStorage.setItem("cartData", JSON.stringify(currentCart));

  // 5. Perbarui tampilan keranjang jika fungsi renderCart dari cart.js ada
  if (typeof renderCart === 'function') {
    // Update data variabel cart global jika ada
    if (typeof cart !== 'undefined') {
      cart = currentCart;
    }
    renderCart();
  }

  alert(`${productToAdd.name} berhasil ditambahkan ke keranjang!`);
}
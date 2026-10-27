// Data Dummy Produk
const products = [
  {
    id: 1,
    name: "Mouse Gaming Wireless",
    category: "elektronik",
    price: 250000,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 2,
    name: "Kaos Polos Cotton Combed",
    category: "pakaian",
    price: 75000,
    image: "https://via.placeholder.com/200"
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
  }
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
function filterProducts() {
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
function addToCart(productId) {
  alert(`Produk ID ${productId} berhasil ditambahkan ke keranjang!`);
}
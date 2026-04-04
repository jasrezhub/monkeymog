// ─── SHARED UTILITIES — Monkey Mog ───────────────────────────────────────────

// ── CART ──
function getCart() { return JSON.parse(localStorage.getItem('mm_cart') || '[]'); }
function saveCart(c) { localStorage.setItem('mm_cart', JSON.stringify(c)); updateCartCount(); }
function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  el.textContent = total;
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  showToast(`"${product.name}" added to cart!`);
}

// ── PRODUCTS ──
function getProducts() {
  const stored = localStorage.getItem('mm_products');
  if (stored) return JSON.parse(stored);
  const defaults = [
    { id: 1, name: 'Morning Mug', desc: 'A wide, comfortable mug perfect for your morning coffee or tea.', price: 55, emoji: '☕', category: 'Mugs' },
    { id: 2, name: 'Bud Vase', desc: 'A slim, elegant vase for a single stem or small bouquet.', price: 75, emoji: '🌸', category: 'Vases' },
    { id: 3, name: 'Serving Bowl', desc: 'A generous hand-thrown bowl for salads, fruit, or display.', price: 120, emoji: '🥗', category: 'Bowls' },
    { id: 4, name: 'Spice Pinch Pot', desc: 'A small open vessel, ideal for salt, spices, or trinkets.', price: 55, emoji: '🏺', category: 'Small Pieces' },
    { id: 5, name: 'Tall Vase', desc: 'A striking tall form that stands beautifully on its own.', price: 150, emoji: '🌿', category: 'Vases' },
    { id: 6, name: 'Soup Crock', desc: 'A deep, lidded crock perfect for soups and stews.', price: 95, emoji: '🍲', category: 'Bowls' },
  ];
  localStorage.setItem('mm_products', JSON.stringify(defaults));
  return defaults;
}
function saveProducts(products) { localStorage.setItem('mm_products', JSON.stringify(products)); }

// ── REVIEWS ──
function getReviews() {
  const stored = localStorage.getItem('mm_reviews');
  if (stored) return JSON.parse(stored);
  const defaults = [
    { name: 'Sarah K.', rating: 5, text: 'The morning mug I ordered is absolutely gorgeous. The glaze is so rich and it feels wonderful in my hands. Already ordered another!' },
    { name: 'James T.', rating: 5, text: 'Got the serving bowl as a gift. My friend was blown away. Ships fast and packaged beautifully. Highly recommend.' },
    { name: 'Maria L.', rating: 4, text: 'Beautiful work and great communication. The bud vase is even prettier in person than in the photo.' },
  ];
  localStorage.setItem('mm_reviews', JSON.stringify(defaults));
  return defaults;
}

// ── RENDER PRODUCTS ──
function renderFeatured(gridId, limit) {
  const products = limit ? getProducts().slice(0, limit) : getProducts();
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="window.location='product.html?id=${p.id}'">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        ${p.category ? `<div class="product-cat">${p.category}</div>` : ''}
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">$${Number(p.price).toFixed(2)}</div>
          <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart({id:${p.id},name:'${p.name.replace(/'/g,"\\'")}',price:${p.price},emoji:'${p.emoji}'})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── RENDER REVIEWS ──
function renderReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;
  const reviews = getReviews();
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'⭐'.repeat(r.rating)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">— ${r.name}</div>
    </div>
  `).join('');
}

// ── ORDER NUMBER ──
function generateOrderNumber() {
  const prefix = 'MM';
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/**
 * Shop Module
 * Quản lý hiển thị sản phẩm, bộ lọc danh mục, tìm kiếm, xem chi tiết và giỏ hàng
 */

const CART_STORAGE_KEY = 'ecommerce_cart';
let currentCategory = 'all';
let currentSearchQuery = '';
let selectedProductForModal = null;
let modalSelectedSize = 'M';
let modalSelectedColor = '';
let modalQuantity = 1;

/**
 * Lấy danh sách sản phẩm trong giỏ hàng
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Lưu giỏ hàng vào localStorage
 */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

/**
 * Thêm sản phẩm vào giỏ hàng
 */
function addToCart(productId, size = 'M', color = '', quantity = 1) {
  const product = FASHION_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const chosenColor = color || (product.colors && product.colors[0]) || 'Mặc định';
  const chosenSize = size || (product.sizes && product.sizes[0]) || 'FreeSize';

  // Kiểm tra sản phẩm cùng ID, Size, Color đã có chưa
  const existingIndex = cart.findIndex(
    item => item.id === productId && item.size === chosenSize && item.color === chosenColor
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: chosenSize,
      color: chosenColor,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`Đã thêm "${product.name}" (${chosenSize}) vào giỏ hàng!`, 'success');
}

/**
 * Thay đổi số lượng sản phẩm trong giỏ
 */
function updateCartItemQuantity(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
}

/**
 * Xóa 1 sản phẩm khỏi giỏ
 */
function removeCartItem(index) {
  const cart = getCart();
  if (!cart[index]) return;
  const removedName = cart[index].name;
  cart.splice(index, 1);
  saveCart(cart);
  showToast(`Đã xóa sản phẩm "${removedName}" khỏi giỏ hàng!`, 'info');
}

/**
 * Cập nhật số lượng sản phẩm trên icon Giỏ hàng
 */
function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badgeEl = document.getElementById('cart-badge-count');
  if (badgeEl) {
    badgeEl.textContent = totalCount;
    if (totalCount > 0) {
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  }
}

/**
 * Hiển thị giỏ hàng trong thanh trượt (Drawer)
 */
function renderCartDrawer() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-drawer-items');
  const cartSubtotalEl = document.getElementById('cart-drawer-subtotal');
  const cartEmptyEl = document.getElementById('cart-drawer-empty');
  const cartFooterEl = document.getElementById('cart-drawer-footer');

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    if (cartEmptyEl) cartEmptyEl.classList.remove('hidden');
    if (cartFooterEl) cartFooterEl.classList.add('hidden');
    return;
  }

  if (cartEmptyEl) cartEmptyEl.classList.add('hidden');
  if (cartFooterEl) cartFooterEl.classList.remove('hidden');

  let total = 0;
  cartItemsContainer.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0 animate-fade-in">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded-xl shadow-sm">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-gray-800 truncate">${item.name}</h4>
          <p class="text-xs text-gray-500 mt-0.5">Size: <span class="font-medium text-gray-700">${item.size}</span> | Màu: <span class="font-medium text-gray-700">${item.color}</span></p>
          <p class="text-sm font-bold text-indigo-600 mt-1">${formatVND(item.price)}</p>
          
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button onclick="updateCartItemQuantity(${idx}, -1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold">-</button>
              <span class="w-8 text-center text-xs font-semibold text-gray-800">${item.quantity}</span>
              <button onclick="updateCartItemQuantity(${idx}, 1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition font-bold">+</button>
            </div>
            <button onclick="removeCartItem(${idx})" class="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition">
              <i data-lucide="trash-2" class="w-4 h-4"></i> Xóa
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = formatVND(total);
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Đóng/mở Giỏ hàng Drawer
 */
function toggleCartDrawer(open = null) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer) return;

  const isOpen = !drawer.classList.contains('translate-x-full');
  const shouldOpen = open !== null ? open : !isOpen;

  if (shouldOpen) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    renderCartDrawer();
  } else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
  }
}

/**
 * Giả lập đặt hàng thanh toán
 */
function checkoutCart() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Giỏ hàng của bạn đang trống!', 'warning');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Hiển thị thông báo xác nhận thành công
  alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\nTổng giá trị: ${formatVND(total)}\nSố món: ${cart.length}\nPhương thức: Thanh toán khi nhận hàng (COD)\n\nCảm ơn bạn đã mua sắm tại Luxe Fashion!`);
  
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadge();
  toggleCartDrawer(false);
}

/**
 * Hiển thị danh sách sản phẩm theo bộ lọc & từ khóa
 */
function renderProductList() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = FASHION_PRODUCTS.filter(item => {
    const matchCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchQuery = !currentSearchQuery || 
      item.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(currentSearchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const countEl = document.getElementById('product-count-display');
  if (countEl) {
    countEl.textContent = `Tìm thấy ${filtered.length} sản phẩm`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <i data-lucide="package-x" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-700">Không tìm thấy sản phẩm phù hợp</h3>
        <p class="text-sm text-gray-500 mt-1">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.</p>
        <button onclick="setCategoryFilter('all')" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          Xem tất cả sản phẩm
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="product-card group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <!-- Ảnh & Badges -->
      <div class="relative overflow-hidden img-container aspect-[3/4] bg-gray-100 cursor-pointer" onclick="openProductModal(${item.id})">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
        
        ${item.badge ? `
          <span class="absolute top-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full ${item.badgeColor} shadow-md">
            ${item.badge}
          </span>
        ` : ''}

        <!-- Quick View Overlay Button -->
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button onclick="event.stopPropagation(); openProductModal(${item.id})" class="p-3 bg-white/95 rounded-full text-gray-800 shadow-lg hover:scale-110 hover:bg-indigo-600 hover:text-white transition">
            <i data-lucide="eye" class="w-5 h-5"></i>
          </button>
        </div>
      </div>

      <!-- Thông tin -->
      <div class="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span class="font-medium text-indigo-600 uppercase tracking-wider">${item.categoryLabel}</span>
            <div class="flex items-center gap-1 text-amber-500 font-semibold">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <span>${item.rating}</span>
              <span class="text-gray-400 font-normal">(${item.reviewsCount})</span>
            </div>
          </div>
          <h3 onclick="openProductModal(${item.id})" class="font-bold text-gray-900 line-clamp-2 hover:text-indigo-600 transition cursor-pointer text-base leading-snug">
            ${item.name}
          </h3>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span class="text-lg font-extrabold text-gray-900">${formatVND(item.price)}</span>
            ${item.originalPrice ? `
              <span class="text-xs text-gray-400 line-through block">${formatVND(item.originalPrice)}</span>
            ` : ''}
          </div>
          <button onclick="addToCart(${item.id})" class="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-sm font-semibold transition duration-200">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Đổi danh mục lọc
 */
function setCategoryFilter(category) {
  currentCategory = category;
  
  // Update button active state
  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    if (btn.dataset.category === category) {
      btn.className = 'cat-filter-btn px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white shadow-sm transition';
    } else {
      btn.className = 'cat-filter-btn px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition';
    }
  });

  renderProductList();
}

/**
 * Mở modal chi tiết sản phẩm
 */
function openProductModal(productId) {
  const product = FASHION_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  selectedProductForModal = product;
  modalSelectedSize = product.sizes[0] || 'M';
  modalSelectedColor = product.colors[0] || '';
  modalQuantity = 1;

  const modal = document.getElementById('product-detail-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal) return;

  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-img').alt = product.name;
  document.getElementById('modal-product-category').textContent = product.categoryLabel;
  document.getElementById('modal-product-title').textContent = product.name;
  document.getElementById('modal-product-price').textContent = formatVND(product.price);
  document.getElementById('modal-product-original').textContent = product.originalPrice ? formatVND(product.originalPrice) : '';
  document.getElementById('modal-product-rating').textContent = `${product.rating} (${product.reviewsCount} đánh giá)`;
  document.getElementById('modal-product-desc').textContent = product.description;
  document.getElementById('modal-product-qty').textContent = '1';

  // Render sizes
  const sizesContainer = document.getElementById('modal-sizes-container');
  sizesContainer.innerHTML = product.sizes.map(size => `
    <button onclick="selectModalSize('${size}', this)" class="modal-size-btn px-3.5 py-1.5 border rounded-lg text-sm font-medium transition ${size === modalSelectedSize ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-bold' : 'border-gray-200 text-gray-700 hover:border-gray-400'}">
      ${size}
    </button>
  `).join('');

  // Render colors
  const colorsContainer = document.getElementById('modal-colors-container');
  colorsContainer.innerHTML = product.colors.map(color => `
    <button onclick="selectModalColor('${color}', this)" class="modal-color-btn px-3 py-1 border rounded-lg text-xs font-medium transition ${color === modalSelectedColor ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-400'}">
      ${color}
    </button>
  `).join('');

  modal.classList.remove('hidden');
  backdrop.classList.remove('opacity-0', 'pointer-events-none');

  if (window.lucide) window.lucide.createIcons();
}

function selectModalSize(size, el) {
  modalSelectedSize = size;
  document.querySelectorAll('.modal-size-btn').forEach(btn => {
    btn.className = 'modal-size-btn px-3.5 py-1.5 border border-gray-200 text-gray-700 hover:border-gray-400 rounded-lg text-sm font-medium transition';
  });
  el.className = 'modal-size-btn px-3.5 py-1.5 border border-indigo-600 bg-indigo-50 text-indigo-600 font-bold rounded-lg text-sm transition';
}

function selectModalColor(color, el) {
  modalSelectedColor = color;
  document.querySelectorAll('.modal-color-btn').forEach(btn => {
    btn.className = 'modal-color-btn px-3 py-1 border border-gray-200 text-gray-600 hover:border-gray-400 rounded-lg text-xs font-medium transition';
  });
  el.className = 'modal-color-btn px-3 py-1 border border-indigo-600 bg-indigo-50 text-indigo-600 font-semibold rounded-lg text-xs transition';
}

function changeModalQuantity(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  document.getElementById('modal-product-qty').textContent = modalQuantity;
}

function addModalProductToCart() {
  if (!selectedProductForModal) return;
  addToCart(selectedProductForModal.id, modalSelectedSize, modalSelectedColor, modalQuantity);
  closeProductModal();
}

function closeProductModal() {
  const modal = document.getElementById('product-detail-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (modal) modal.classList.add('hidden');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
}

/**
 * Hiển thị Toast thông báo ngắn
 */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-gray-900 text-white' : (type === 'warning' ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white');
  toast.className = `${bgColor} px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-fade-in transition-all duration-300`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

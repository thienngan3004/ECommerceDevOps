/**
 * Authentication Module
 * Quản lý đăng nhập, phân quyền (Admin / User) và phiên làm việc
 */

const AUTH_STORAGE_KEY = 'ecommerce_current_user';

// Cấu hình tài khoản mặc định
const ACCOUNTS = {
  admin: {
    username: 'admin',
    password: '123456',
    name: 'Admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'admin@luxe-fashion.vn'
  },
  user: {
    username: 'tngan',
    password: '1234',
    name: 'Hồ Thiên Ngân',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    email: 'thienngan@gmail.com'
  }
};

/**
 * Lấy thông tin user hiện tại từ localStorage
 */
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Lỗi đọc auth storage:', e);
    return null;
  }
}

/**
 * Xử lý đăng nhập
 * @param {string} username 
 * @param {string} password 
 * @returns {object} { success: boolean, message: string, redirectUrl: string }
 */
function login(username, password) {
  const trimmedUser = (username || '').trim().toLowerCase();
  const trimmedPass = (password || '').trim();

  if (!trimmedUser || !trimmedPass) {
    return {
      success: false,
      message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!'
    };
  }

  // Trường hợp 1: Đăng nhập quyền Admin
  if (trimmedUser === 'admin') {
    if (trimmedPass === '123456') {
      const adminUser = ACCOUNTS.admin;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      return {
        success: true,
        message: 'Đăng nhập Admin thành công! Đang chuyển đến Dashboard quản lý doanh thu...',
        redirectUrl: 'admin-dashboard.html',
        user: adminUser
      };
    } else {
      return {
        success: false,
        message: 'Mật khẩu tài khoản Admin không chính xác!'
      };
    }
  }

  // Trường hợp 2: Đăng nhập quyền User
  // Chấp nhận tài khoản 'user' hoặc bất kỳ tên đăng nhập người dùng nào với mật khẩu hợp lệ
  let userData;
  if (trimmedUser === 'user') {
    userData = ACCOUNTS.user;
  } else {
    // Tài khoản User tự do nhập
    userData = {
      username: trimmedUser,
      name: username,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: `${trimmedUser}@example.com`
    };
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  return {
    success: true,
    message: 'Đăng nhập thành công! Đang chuyển đến Cửa hàng thời trang...',
    redirectUrl: 'shop.html',
    user: userData
  };
}

/**
 * Đăng xuất
 */
function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'index.html';
}

/**
 * Kiểm tra quyền truy cập của trang (Route Guard)
 * @param {'admin'|'user'|null} requiredRole 
 */
function checkAuthGuard(requiredRole) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    // Chưa đăng nhập -> Chuyển về login
    alert('Vui lòng đăng nhập để tiếp tục truy cập!');
    window.location.href = 'index.html';
    return false;
  }

  if (requiredRole === 'admin' && currentUser.role !== 'admin') {
    // Không có quyền admin -> Báo lỗi và chuyển về trang shop
    alert('Bạn không có quyền truy cập trang quản trị Admin! Đang chuyển về cửa hàng...');
    window.location.href = 'shop.html';
    return false;
  }

  return true;
}

/**
 * Cập nhật thông tin User trên Header/Navbar
 */
function renderNavbarUser() {
  const currentUser = getCurrentUser();
  const userContainer = document.getElementById('navbar-user-info');
  if (!userContainer) return;

  if (currentUser) {
    userContainer.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${currentUser.avatar}" alt="${currentUser.name}" class="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30">
        <div class="hidden sm:block text-left">
          <p class="text-sm font-semibold text-gray-800 leading-tight">${currentUser.name}</p>
          <span class="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium ${currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}">
            ${currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}
          </span>
        </div>
        ${currentUser.role === 'admin' ? `
          <a href="admin-dashboard.html" title="Trang quản trị" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Vào Dashboard">
            <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
          </a>
        ` : ''}
        <button onclick="logout()" title="Đăng xuất" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
          <i data-lucide="log-out" class="w-5 h-5"></i>
        </button>
      </div>
    `;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

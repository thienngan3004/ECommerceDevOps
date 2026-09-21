/**
 * Admin Dashboard Module
 * Quản lý biểu đồ doanh thu, thống kê kinh doanh thời trang và bảng đơn hàng
 */

let revenueChartInstance = null;
let categoryChartInstance = null;

// Dữ liệu doanh thu mẫu theo các mốc thời gian
const REVENUE_DATA = {
  'year': {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    revenue: [95, 110, 135, 120, 150, 185, 175, 190, 210, 225, 260, 310], // Triệu VND
    orders: [420, 480, 560, 510, 620, 780, 710, 805, 890, 960, 1120, 1340]
  },
  'month': {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    revenue: [38, 45, 52, 60], // Triệu VND
    orders: [160, 195, 220, 265]
  },
  'week': {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    revenue: [6.5, 7.8, 8.2, 9.5, 12.0, 15.5, 18.2], // Triệu VND
    orders: [28, 34, 38, 45, 62, 78, 89]
  }
};

// Dữ liệu đơn hàng gần đây
const RECENT_ORDERS = [
  {
    id: 'ORD-8942',
    customer: 'Lê Minh Quân',
    phone: '0912***456',
    items: 'Áo Sơ Mi Lụa Cổ Bẻ (x2)',
    total: 778000,
    date: 'Hôm nay, 14:32',
    status: 'completed',
    statusText: 'Đã hoàn tất',
    statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'ORD-8941',
    customer: 'Nguyễn Bích Ngọc',
    phone: '0988***112',
    items: 'Áo Khoác Blazer Hàn Quốc (x1)',
    total: 750000,
    date: 'Hôm nay, 13:10',
    status: 'shipping',
    statusText: 'Đang giao hàng',
    statusClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'ORD-8940',
    customer: 'Vũ Hải Đăng',
    phone: '0903***789',
    items: 'Quần Jean Slim-Fit (x1), Áo Polo (x1)',
    total: 780000,
    date: 'Hôm nay, 11:45',
    status: 'processing',
    statusText: 'Đang chuẩn bị',
    statusClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'ORD-8939',
    customer: 'Phạm Quỳnh Anh',
    phone: '0977***334',
    items: 'Đầm Maxi Voan Hoa Nhí (x2)',
    total: 920000,
    date: 'Hôm qua, 18:20',
    status: 'completed',
    statusText: 'Đã hoàn tất',
    statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'ORD-8938',
    customer: 'Hoàng Quốc Bảo',
    phone: '0934***678',
    items: 'Áo Thun Cotton Oversize (x3)',
    total: 747000,
    date: 'Hôm qua, 15:05',
    status: 'cancelled',
    statusText: 'Đã hủy đơn',
    statusClass: 'bg-red-50 text-red-700 border-red-200'
  }
];

// Top sản phẩm thời trang bán chạy
const TOP_PRODUCTS = [
  {
    name: 'Áo Khoác Blazer Hàn Quốc Phom Rộng',
    category: 'Áo khoác',
    sales: '320 cái',
    revenue: '240.000.000₫',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Áo Sơ Mi Lụa Cổ Bẻ Cao Cấp Classic',
    category: 'Áo sơ mi',
    sales: '512 cái',
    revenue: '199.168.000₫',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Áo Thun Cotton Nén Oversize',
    category: 'Áo thun',
    sales: '740 cái',
    revenue: '184.260.000₫',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Quần Jean Slim-Fit Denim Co Giãn',
    category: 'Quần',
    sales: '345 cái',
    revenue: '170.775.000₫',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=150&auto=format&fit=crop&q=80'
  }
];

/**
 * Khởi tạo Dashboard
 */
function initDashboard() {
  // Kiểm tra quyền Admin
  if (!checkAuthGuard('admin')) return;

  renderNavbarUser();
  initRevenueChart('year');
  initCategoryChart();
  renderRecentOrdersTable();
  renderTopProducts();
}

/**
 * Khởi tạo Biểu đồ doanh thu với Chart.js
 */
function initRevenueChart(period = 'year') {
  const ctx = document.getElementById('revenueMainChart');
  if (!ctx) return;

  const data = REVENUE_DATA[period];

  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Doanh thu (Triệu VNĐ)',
          data: data.revenue,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#4f46e5',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1e1b4b',
          titleFont: { family: 'Plus Jakarta Sans', size: 13 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            label: function(context) {
              return ` Doanh thu: ${context.parsed.y} Triệu VNĐ`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#64748b' }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            font: { family: 'Plus Jakarta Sans', size: 12 },
            color: '#64748b',
            callback: function(val) {
              return val + ' tr';
            }
          }
        }
      }
    }
  });
}

/**
 * Khởi tạo Biểu đồ tỷ trọng danh mục
 */
function initCategoryChart() {
  const ctx = document.getElementById('categoryPieChart');
  if (!ctx) return;

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Áo khoác / Blazer', 'Áo sơ mi', 'Áo thun & Polo', 'Quần Jean & Tây', 'Váy đầm'],
      datasets: [{
        data: [32, 26, 22, 12, 8],
        backgroundColor: [
          '#4f46e5', // Indigo
          '#06b6d4', // Cyan
          '#10b981', // Emerald
          '#f59e0b', // Amber
          '#ec4899'  // Pink
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 16,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}

/**
 * Đổi thời gian xem biểu đồ doanh thu
 */
function switchRevenuePeriod(period, btn) {
  document.querySelectorAll('.period-btn').forEach(b => {
    b.className = 'period-btn px-3 py-1.5 text-xs font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition';
  });
  btn.className = 'period-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 transition';

  initRevenueChart(period);
}

/**
 * Render bảng đơn hàng gần đây
 */
function renderRecentOrdersTable() {
  const container = document.getElementById('recent-orders-body');
  if (!container) return;

  container.innerHTML = RECENT_ORDERS.map(order => `
    <tr class="hover:bg-gray-50/70 transition border-b border-gray-100 last:border-b-0 text-sm">
      <td class="py-3.5 px-4 font-semibold text-indigo-600 font-mono">${order.id}</td>
      <td class="py-3.5 px-4">
        <div class="font-medium text-gray-900">${order.customer}</div>
        <div class="text-xs text-gray-400">${order.phone}</div>
      </td>
      <td class="py-3.5 px-4 text-gray-600 max-w-xs truncate">${order.items}</td>
      <td class="py-3.5 px-4 font-bold text-gray-900">${formatVND(order.total)}</td>
      <td class="py-3.5 px-4 text-xs text-gray-500">${order.date}</td>
      <td class="py-3.5 px-4">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${order.statusClass}">
          ${order.statusText}
        </span>
      </td>
      <td class="py-3.5 px-4 text-right">
        <button onclick="viewOrderDetail('${order.id}')" class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-indigo-600 transition" title="Chi tiết đơn">
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Render danh sách sản phẩm bán chạy
 */
function renderTopProducts() {
  const container = document.getElementById('top-products-list');
  if (!container) return;

  container.innerHTML = TOP_PRODUCTS.map((prod, idx) => `
    <div class="flex items-center gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-100/60">
      <span class="w-6 text-center font-bold text-sm ${idx === 0 ? 'text-amber-500' : 'text-gray-400'}">#${idx + 1}</span>
      <img src="${prod.image}" alt="${prod.name}" class="w-12 h-12 rounded-lg object-cover shadow-sm">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-gray-900 truncate">${prod.name}</h4>
        <p class="text-xs text-gray-500">${prod.category} • Đã bán ${prod.sales}</p>
      </div>
      <div class="text-right">
        <span class="text-sm font-bold text-indigo-600 block">${prod.revenue}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Xem chi tiết đơn hàng
 */
function viewOrderDetail(orderId) {
  const order = RECENT_ORDERS.find(o => o.id === orderId);
  if (!order) return;

  alert(`📋 CHI TIẾT ĐƠN HÀNG: ${order.id}\n\n- Khách hàng: ${order.customer} (${order.phone})\n- Mặt hàng: ${order.items}\n- Tổng tiền: ${formatVND(order.total)}\n- Trạng thái: ${order.statusText}\n- Thời gian: ${order.date}`);
}

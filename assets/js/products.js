/**
 * Products Module
 * Danh mục sản phẩm thời trang (Quần áo & Phụ kiện) với hình ảnh chất lượng cao
 */

const FASHION_PRODUCTS = [
  {
    id: 1,
    name: 'Áo Sơ Mi Lụa Cổ Bẻ Cao Cấp Classic',
    category: 'shirt',
    categoryLabel: 'Áo sơ mi',
    price: 389000,
    originalPrice: 499000,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    badge: 'Bán chạy',
    badgeColor: 'bg-rose-500',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng Oxford', 'Xanh Pastel', 'Đen Tuyển'],
    description: 'Chất liệu lụa pha cotton cao cấp chống nhăn, phom dáng chuẩn công sở lẫn dạo phố sang trọng, thoáng mát suốt ngày dài.',
    stock: 45
  },
  {
    id: 2,
    name: 'Áo Thun Cotton Nén Heavyweight Oversize',
    category: 'tshirt',
    categoryLabel: 'Áo thun',
    price: 249000,
    originalPrice: 320000,
    rating: 4.8,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    badge: 'Mới',
    badgeColor: 'bg-emerald-500',
    sizes: ['M', 'L', 'XL', '2XL'],
    colors: ['Đen Phantom', 'Trắng Kem', 'Xanh Rêu'],
    description: '100% cotton định lượng 250gsm dày dặn, đứng phom, thấm hút mồ hôi tối ưu, phong cách đường phố năng động.',
    stock: 82
  },
  {
    id: 3,
    name: 'Áo Khoác Blazer Hàn Quốc Phom Rộng Minimalist',
    category: 'jacket',
    categoryLabel: 'Áo khoác',
    price: 750000,
    originalPrice: 950000,
    rating: 5.0,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    badge: 'Hot Trend',
    badgeColor: 'bg-amber-500',
    sizes: ['M', 'L', 'XL'],
    colors: ['Nâu Be', 'Xám Tro', 'Đen Cổ Điển'],
    description: 'Thiết kế 2 lớp cao cấp với lớp lót dù mềm mại, đệm vai tinh tế tạo phong thái chỉn chu, quyền lực.',
    stock: 28
  },
  {
    id: 4,
    name: 'Quần Jean Slim-Fit Denim Co Giãn 4 Chiều',
    category: 'pants',
    categoryLabel: 'Quần',
    price: 495000,
    originalPrice: 620000,
    rating: 4.7,
    reviewsCount: 204,
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
    badge: 'Giảm 20%',
    badgeColor: 'bg-indigo-600',
    sizes: ['29', '30', '31', '32', '34'],
    colors: ['Xanh Indigo', 'Xanh Khói Wash', 'Đen Chàm'],
    description: 'Chất jean dệt chéo cao cấp pha sợi spandex đàn hồi, tôn dáng đôi chân, mang lại cảm giác dễ chịu khi vận động.',
    stock: 64
  },
  {
    id: 5,
    name: 'Đầm Maxi Voan Hoa Nhí Duyên Dáng Dạo Phố',
    category: 'dress',
    categoryLabel: 'Váy đầm',
    price: 460000,
    originalPrice: 590000,
    rating: 4.9,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    badge: 'Nổi bật',
    badgeColor: 'bg-purple-600',
    sizes: ['S', 'M', 'L'],
    colors: ['Hoa Vàng Vintage', 'Hoa Đỏ Pastel'],
    description: 'Chất voan tơ 2 lớp bồng bềnh, chiết eo nhẹ nhàng tôn dáng dịu dàng cho những buổi hẹn hò hay du lịch.',
    stock: 36
  },
  {
    id: 6,
    name: 'Áo Khoác Bomber Kaki Dày 2 Lớp Chống Gió',
    category: 'jacket',
    categoryLabel: 'Áo khoác',
    price: 580000,
    originalPrice: 720000,
    rating: 4.8,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    badgeColor: 'bg-rose-600',
    sizes: ['M', 'L', 'XL'],
    colors: ['Xanh Rêu Quân Đội', 'Đen Mờ', 'Be Sữa'],
    description: 'Chống thấm nước nhẹ và cản gió xuất sắc, bo thun cổ tay ôm sát giữ ấm tốt cho mùa thu đông.',
    stock: 52
  },
  {
    id: 7,
    name: 'Quần Tây Âu Baggy Xếp Ly Lịch Lãm',
    category: 'pants',
    categoryLabel: 'Quần',
    price: 420000,
    originalPrice: 550000,
    rating: 4.6,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    badge: null,
    badgeColor: '',
    sizes: ['28', '29', '30', '31', '32'],
    colors: ['Đen', 'Xám Đậm', 'Nâu Tây'],
    description: 'Chất vải tuyết mưa nhập khẩu mềm mịn, không bai xù, đường ly sắc sảo mang lại vẻ ngoài thanh lịch chuẩn chỉnh.',
    stock: 40
  },
  {
    id: 8,
    name: 'Áo Polo Thể Thao Pique Dệt Tổ Ong Thoáng Khí',
    category: 'tshirt',
    categoryLabel: 'Áo thun',
    price: 285000,
    originalPrice: 350000,
    rating: 4.9,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
    badge: 'Mới Về',
    badgeColor: 'bg-emerald-600',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Trắng Viền Cổ', 'Xanh Navy', 'Đỏ Rượu'],
    description: 'Công nghệ dệt tổ ong thấm hút mồ hôi cực nhanh, bo cổ dệt đanh không lo bị dão sau nhiều lần giặt.',
    stock: 75
  }
];

/**
 * Định dạng tiền tệ VND: 350000 -> 350.000₫
 */
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount).replace('₫', '₫');
}

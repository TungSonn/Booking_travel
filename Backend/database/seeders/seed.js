/**
 * Database Seeder – TravelBook
 * Tạo dữ liệu mẫu cho development / demo.
 *
 * Usage:
 *   node database/seeders/seed.js
 *
 * Tạo:
 *   - 1 Admin
 *   - 2 Hotel Owners + 4 Hotels
 *   - 2 Guide Users + 2 Guide Profiles
 *   - 3 Customers
 *   - 6 Tours
 *   - Sample Bookings & Reviews
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   TravelBook – Database Seeder           ║');
  console.log('╚══════════════════════════════════════════╝\n');

  const { sequelize, User, Hotel, Tour, Guide, Booking, Review } = require('../../src/models');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check if data already exists
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('⚠️  Database already has data. Skipping seed.');
      console.log('   Use "npm run migrate -- --fresh" to reset and re-seed.\n');
      await sequelize.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Password123!', 12);
    const now = new Date();

    // ─────────────────────────────────────────────────────────────
    // USERS
    // ─────────────────────────────────────────────────────────────
    const adminId      = uuidv4();
    const owner1Id     = uuidv4();
    const owner2Id     = uuidv4();
    const guideUser1Id = uuidv4();
    const guideUser2Id = uuidv4();
    const customer1Id  = uuidv4();
    const customer2Id  = uuidv4();
    const customer3Id  = uuidv4();

    const users = [
      { id: adminId,      full_name: 'Admin TravelBook', email: 'admin@travelbook.vn',    password: hashedPassword, role: 'admin',       is_active: true, email_verified: true },
      { id: owner1Id,     full_name: 'Nguyễn Văn Hùng',  email: 'hung.hotel@gmail.com',   password: hashedPassword, role: 'hotel_owner', is_active: true, email_verified: true, phone: '0901234567' },
      { id: owner2Id,     full_name: 'Trần Thị Mai',     email: 'mai.hotel@gmail.com',    password: hashedPassword, role: 'hotel_owner', is_active: true, email_verified: true, phone: '0912345678' },
      { id: guideUser1Id, full_name: 'Lê Minh Tuấn',     email: 'tuan.guide@gmail.com',   password: hashedPassword, role: 'guide',       is_active: true, email_verified: true, phone: '0923456789' },
      { id: guideUser2Id, full_name: 'Phạm Thanh Hà',    email: 'ha.guide@gmail.com',     password: hashedPassword, role: 'guide',       is_active: true, email_verified: true, phone: '0934567890' },
      { id: customer1Id,  full_name: 'Hoàng Anh Dũng',   email: 'dung.customer@gmail.com', password: hashedPassword, role: 'customer',   is_active: true, email_verified: true, phone: '0945678901' },
      { id: customer2Id,  full_name: 'Vũ Thị Lan',       email: 'lan.customer@gmail.com',  password: hashedPassword, role: 'customer',   is_active: true, email_verified: true, phone: '0956789012' },
      { id: customer3Id,  full_name: 'Đỗ Quang Minh',    email: 'minh.customer@gmail.com', password: hashedPassword, role: 'customer',   is_active: true, email_verified: true, phone: '0967890123' },
    ];

    await User.bulkCreate(users, { hooks: false }); // hooks: false because password already hashed
    console.log(`✅ ${users.length} users created`);

    // ─────────────────────────────────────────────────────────────
    // HOTELS
    // ─────────────────────────────────────────────────────────────
    const hotel1Id = uuidv4();
    const hotel2Id = uuidv4();
    const hotel3Id = uuidv4();
    const hotel4Id = uuidv4();

    const hotels = [
      {
        id: hotel1Id, owner_id: owner1Id,
        name: 'Sài Gòn Pearl Hotel & Spa',
        slug: 'sai-gon-pearl-hotel-spa',
        description: 'Khách sạn 5 sao tọa lạc tại trung tâm Quận 1, TP.HCM. Hồ bơi vô cực trên tầng thượng, nhà hàng Á-Âu, spa cao cấp.',
        address: '92 Nguyễn Huệ, Quận 1', city: 'Hồ Chí Minh', province: 'Hồ Chí Minh',
        latitude: 10.7735, longitude: 106.7021,
        star_rating: 5, price_per_night: 3500000, currency: 'VND',
        amenities: JSON.stringify(['wifi','pool','gym','spa','restaurant','parking','airport_shuttle']),
        total_rooms: 120, available_rooms: 45,
        is_active: true, is_verified: true, avg_rating: 4.70, total_reviews: 128,
      },
      {
        id: hotel2Id, owner_id: owner1Id,
        name: 'Hội An Riverside Boutique',
        slug: 'hoi-an-riverside-boutique',
        description: 'Boutique hotel yên bình bên sông Thu Bồn. Kiến trúc phố cổ hòa quyện hiện đại, vườn nhiệt đới xanh mát.',
        address: '15 Bạch Đằng, Minh An', city: 'Hội An', province: 'Quảng Nam',
        latitude: 15.8801, longitude: 108.3380,
        star_rating: 4, price_per_night: 1800000, currency: 'VND',
        amenities: JSON.stringify(['wifi','pool','restaurant','bicycle_rental','garden']),
        total_rooms: 35, available_rooms: 12,
        is_active: true, is_verified: true, avg_rating: 4.85, total_reviews: 95,
      },
      {
        id: hotel3Id, owner_id: owner2Id,
        name: 'Đà Lạt Palace Heritage',
        slug: 'da-lat-palace-heritage',
        description: 'Khách sạn di sản với kiến trúc Pháp cổ điển từ năm 1922. Tọa lạc trên đồi với view toàn cảnh hồ Xuân Hương.',
        address: '12 Trần Phú', city: 'Đà Lạt', province: 'Lâm Đồng',
        latitude: 11.9465, longitude: 108.4383,
        star_rating: 5, price_per_night: 4200000, currency: 'VND',
        amenities: JSON.stringify(['wifi','restaurant','spa','bar','tennis','golf','garden']),
        total_rooms: 80, available_rooms: 22,
        is_active: true, is_verified: true, avg_rating: 4.60, total_reviews: 73,
      },
      {
        id: hotel4Id, owner_id: owner2Id,
        name: 'Phú Quốc Sunset Beach Resort',
        slug: 'phu-quoc-sunset-beach-resort',
        description: 'Resort biển 4 sao với bãi cát trắng riêng tư. Villa hướng biển, bể bơi nước mặn và nhà hàng hải sản tươi sống.',
        address: 'Bãi Trường, Dương Tơ', city: 'Phú Quốc', province: 'Kiên Giang',
        latitude: 10.2108, longitude: 103.9552,
        star_rating: 4, price_per_night: 2800000, currency: 'VND',
        amenities: JSON.stringify(['wifi','pool','beach','restaurant','bar','kayak','snorkeling']),
        total_rooms: 60, available_rooms: 18,
        is_active: true, is_verified: false, avg_rating: 4.45, total_reviews: 42,
      },
    ];

    await Hotel.bulkCreate(hotels);
    console.log(`✅ ${hotels.length} hotels created`);

    // ─────────────────────────────────────────────────────────────
    // GUIDES
    // ─────────────────────────────────────────────────────────────
    const guide1Id = uuidv4();
    const guide2Id = uuidv4();

    const guides = [
      {
        id: guide1Id, user_id: guideUser1Id,
        bio: 'HDV quốc tế với 8 năm kinh nghiệm, chuyên tour văn hóa miền Trung. Từng dẫn đoàn cho National Geographic và BBC Travel.',
        languages: JSON.stringify(['Vietnamese', 'English', 'French']),
        specialties: JSON.stringify(['history', 'culture', 'food', 'photography']),
        areas: JSON.stringify(['Huế', 'Đà Nẵng', 'Hội An', 'Mỹ Sơn']),
        price_per_day: 1500000, price_per_half_day: 800000,
        years_experience: 8, license_number: 'HDV-MN-2018-0456',
        available_days: JSON.stringify(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']),
        max_group_size: 15,
        is_active: true, is_verified: true, avg_rating: 4.90, total_reviews: 67, total_tours_guided: 340,
      },
      {
        id: guide2Id, user_id: guideUser2Id,
        bio: 'HDV trẻ năng động, chuyên tour phiêu lưu và trekking. Người bản địa Sapa với kiến thức sâu về văn hóa các dân tộc.',
        languages: JSON.stringify(['Vietnamese', 'English', 'Hmong']),
        specialties: JSON.stringify(['trekking', 'adventure', 'ethnic_culture', 'nature']),
        areas: JSON.stringify(['Sapa', 'Hà Giang', 'Lào Cai', 'Yên Bái']),
        price_per_day: 1200000, price_per_half_day: 650000,
        years_experience: 5, license_number: 'HDV-MB-2021-0891',
        available_days: JSON.stringify(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']),
        max_group_size: 12,
        is_active: true, is_verified: true, avg_rating: 4.75, total_reviews: 38, total_tours_guided: 180,
      },
    ];

    await Guide.bulkCreate(guides);
    console.log(`✅ ${guides.length} guides created`);

    // ─────────────────────────────────────────────────────────────
    // TOURS
    // ─────────────────────────────────────────────────────────────
    const tour1Id = uuidv4();
    const tour2Id = uuidv4();
    const tour3Id = uuidv4();
    const tour4Id = uuidv4();
    const tour5Id = uuidv4();
    const tour6Id = uuidv4();

    const tours = [
      {
        id: tour1Id, created_by: adminId,
        name: 'Khám Phá Di Sản Miền Trung',
        slug: 'kham-pha-di-san-mien-trung',
        description: 'Hành trình 5 ngày khám phá 3 di sản UNESCO: Cố đô Huế, Phố cổ Hội An và Thánh địa Mỹ Sơn. Trải nghiệm ẩm thực đường phố và văn hóa địa phương.',
        highlights: JSON.stringify(['Cố đô Huế', 'Phố cổ Hội An', 'Thánh địa Mỹ Sơn', 'Bà Nà Hills', 'Ẩm thực miền Trung']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Đà Nẵng – Huế', description: 'Đón sân bay Đà Nẵng, di chuyển ra Huế qua đèo Hải Vân.' },
          { day: 2, title: 'Khám phá Huế', description: 'Tham quan Đại Nội, chùa Thiên Mụ, lăng Minh Mạng. Thưởng thức bún bò Huế.' },
          { day: 3, title: 'Huế – Hội An', description: 'Di chuyển về Hội An, tham quan phố cổ, chùa Cầu, nhà cổ.' },
          { day: 4, title: 'Mỹ Sơn – Bà Nà', description: 'Sáng tham quan Thánh địa Mỹ Sơn, chiều lên Bà Nà Hills.' },
          { day: 5, title: 'Tự do – Tiễn', description: 'Buổi sáng tự do mua sắm, chiều ra sân bay.' },
        ]),
        includes: JSON.stringify(['Khách sạn 4 sao', 'Xe đưa đón', 'Hướng dẫn viên', 'Vé tham quan', 'Bữa sáng']),
        excludes: JSON.stringify(['Vé máy bay', 'Bữa trưa/tối', 'Tip', 'Chi phí cá nhân']),
        destination: 'Miền Trung', departure_city: 'Đà Nẵng',
        duration_days: 5, duration_nights: 4, max_group_size: 16, min_group_size: 2,
        price_per_person: 8500000, price_child: 5100000,
        category: 'cultural', difficulty: 'easy',
        is_active: true, is_featured: true, avg_rating: 4.80, total_reviews: 56, total_bookings: 124,
      },
      {
        id: tour2Id, created_by: adminId,
        name: 'Sapa Trekking & Bản Làng',
        slug: 'sapa-trekking-ban-lang',
        description: 'Trekking qua ruộng bậc thang Sapa, homestay bản người Hmong, chinh phục đỉnh Fansipan.',
        highlights: JSON.stringify(['Ruộng bậc thang', 'Bản Cát Cát', 'Đỉnh Fansipan', 'Homestay', 'Chợ phiên']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Hà Nội – Sapa', description: 'Xe limousine Hà Nội – Sapa, nhận phòng homestay.' },
          { day: 2, title: 'Trek bản làng', description: 'Trekking Cát Cát – Sín Chải, ngắm ruộng bậc thang.' },
          { day: 3, title: 'Fansipan', description: 'Chinh phục nóc nhà Đông Dương bằng cáp treo + trekking.' },
          { day: 4, title: 'Chợ phiên – Về HN', description: 'Ghé chợ phiên Bắc Hà (nếu đúng ngày), về Hà Nội.' },
        ]),
        includes: JSON.stringify(['Homestay', 'Xe limousine', 'HDV bản địa', 'Bữa sáng + trưa', 'Vé Fansipan']),
        excludes: JSON.stringify(['Bữa tối', 'Đồ uống', 'Tip']),
        destination: 'Sapa', departure_city: 'Hà Nội',
        duration_days: 4, duration_nights: 3, max_group_size: 12, min_group_size: 2,
        price_per_person: 5900000, price_child: 3500000,
        category: 'adventure', difficulty: 'moderate',
        is_active: true, is_featured: true, avg_rating: 4.65, total_reviews: 41, total_bookings: 89,
      },
      {
        id: tour3Id, created_by: adminId,
        name: 'Phú Quốc Thiên Đường Biển',
        slug: 'phu-quoc-thien-duong-bien',
        description: 'Nghỉ dưỡng biển đảo Phú Quốc: lặn san hô, câu mực đêm, tham quan làng chài và VinWonders.',
        highlights: JSON.stringify(['Lặn san hô', 'Câu mực đêm', 'VinWonders', 'Bãi Sao', 'Safari']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Đón – Check in', description: 'Đón sân bay, check in resort, tự do tắm biển.' },
          { day: 2, title: 'Tour 4 đảo', description: 'Lặn ngắm san hô, câu cá, tắm biển đảo hoang.' },
          { day: 3, title: 'VinWonders + Safari', description: 'Vui chơi VinWonders, tham quan Safari.' },
          { day: 4, title: 'Tự do – Tiễn', description: 'Nghỉ ngơi, mua đặc sản, ra sân bay.' },
        ]),
        includes: JSON.stringify(['Resort 4 sao', 'Xe đưa đón', 'Tour 4 đảo', 'Vé VinWonders', 'Bữa sáng']),
        excludes: JSON.stringify(['Vé máy bay', 'Bữa trưa/tối', 'Chi phí cá nhân']),
        destination: 'Phú Quốc', departure_city: 'Hồ Chí Minh',
        duration_days: 4, duration_nights: 3, max_group_size: 20, min_group_size: 2,
        price_per_person: 7200000, price_child: 4300000,
        category: 'beach', difficulty: 'easy',
        is_active: true, is_featured: true, avg_rating: 4.55, total_reviews: 33, total_bookings: 67,
      },
      {
        id: tour4Id, created_by: adminId,
        name: 'Hà Giang Loop – Cực Bắc Tổ Quốc',
        slug: 'ha-giang-loop-cuc-bac-to-quoc',
        description: 'Hành trình xe máy/ô tô vòng cung Hà Giang 4 ngày. Đèo Mã Pí Lèng, sông Nho Quế, cột cờ Lũng Cú.',
        highlights: JSON.stringify(['Đèo Mã Pí Lèng', 'Cột cờ Lũng Cú', 'Sông Nho Quế', 'Phố cổ Đồng Văn', 'Homestay H\'Mông']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Hà Giang – Quản Bạ', description: 'Khởi hành, qua Cổng Trời, Núi Đôi Quản Bạ.' },
          { day: 2, title: 'Yên Minh – Đồng Văn', description: 'Phố cổ Đồng Văn, dinh nhà Vương.' },
          { day: 3, title: 'Lũng Cú – Mã Pí Lèng', description: 'Cột cờ Lũng Cú, đèo Mã Pí Lèng, sông Nho Quế.' },
          { day: 4, title: 'Mèo Vạc – Hà Giang', description: 'Về Hà Giang, kết thúc hành trình.' },
        ]),
        includes: JSON.stringify(['Homestay', 'Xe máy/ô tô', 'HDV', 'Bữa sáng + trưa', 'Bảo hiểm']),
        excludes: JSON.stringify(['Xăng xe máy', 'Bữa tối', 'Tip']),
        destination: 'Hà Giang', departure_city: 'Hà Nội',
        duration_days: 4, duration_nights: 3, max_group_size: 10, min_group_size: 2,
        price_per_person: 4800000, price_child: 2900000,
        category: 'adventure', difficulty: 'challenging',
        is_active: true, is_featured: false, avg_rating: 4.90, total_reviews: 78, total_bookings: 156,
      },
      {
        id: tour5Id, created_by: adminId,
        name: 'Đà Lạt Mộng Mơ',
        slug: 'da-lat-mong-mo',
        description: 'Khám phá thành phố ngàn hoa: thác Datanla, đồi chè, rừng thông, cà phê view đỉnh đèo.',
        highlights: JSON.stringify(['Thác Datanla', 'Đồi chè Cầu Đất', 'Hồ Tuyền Lâm', 'Chợ đêm', 'Cà phê view đẹp']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Đón – City tour', description: 'Đón sân bay, quảng trường Lâm Viên, chợ đêm.' },
          { day: 2, title: 'Thiên nhiên', description: 'Thác Datanla, cáp treo, hồ Tuyền Lâm, đồi chè.' },
          { day: 3, title: 'Tự do – Tiễn', description: 'Tự do cà phê, mua sắm, ra sân bay.' },
        ]),
        includes: JSON.stringify(['Khách sạn 3 sao', 'Xe đưa đón', 'Vé tham quan', 'Bữa sáng']),
        excludes: JSON.stringify(['Vé máy bay', 'Bữa trưa/tối']),
        destination: 'Đà Lạt', departure_city: 'Hồ Chí Minh',
        duration_days: 3, duration_nights: 2, max_group_size: 20, min_group_size: 2,
        price_per_person: 3500000, price_child: 2100000,
        category: 'nature', difficulty: 'easy',
        is_active: true, is_featured: false, avg_rating: 4.40, total_reviews: 22, total_bookings: 45,
      },
      {
        id: tour6Id, created_by: adminId,
        name: 'Food Tour Sài Gòn Về Đêm',
        slug: 'food-tour-sai-gon-ve-dem',
        description: 'Trải nghiệm ẩm thực đường phố Sài Gòn trên xe máy: phở, bánh mì, hủ tiếu, chè, cà phê sữa đá. 10 điểm dừng, 15 món.',
        highlights: JSON.stringify(['Phở Hòa', 'Bánh mì Huỳnh Hoa', 'Hủ tiếu Nam Vang', 'Chè Thái', 'Cà phê vợt']),
        itinerary: JSON.stringify([
          { day: 1, title: 'Food tour đêm', description: '4 tiếng khám phá ẩm thực đường phố, 10 điểm dừng bằng xe máy.' },
        ]),
        includes: JSON.stringify(['Xe máy + tài xế', 'Tất cả đồ ăn', 'Nước uống', 'HDV tiếng Anh']),
        excludes: JSON.stringify(['Đồ uống có cồn', 'Tip']),
        destination: 'Hồ Chí Minh', departure_city: 'Hồ Chí Minh',
        duration_days: 1, duration_nights: 0, max_group_size: 8, min_group_size: 1,
        price_per_person: 950000, price_child: 600000,
        category: 'cultural', difficulty: 'easy',
        is_active: true, is_featured: true, avg_rating: 4.95, total_reviews: 112, total_bookings: 380,
      },
    ];

    await Tour.bulkCreate(tours);
    console.log(`✅ ${tours.length} tours created`);

    // ─────────────────────────────────────────────────────────────
    // TOUR ↔ GUIDE associations
    // ─────────────────────────────────────────────────────────────
    const tour1Instance = await Tour.findByPk(tour1Id);
    const tour2Instance = await Tour.findByPk(tour2Id);
    const guide1Instance = await Guide.findByPk(guide1Id);
    const guide2Instance = await Guide.findByPk(guide2Id);

    if (tour1Instance && guide1Instance) await tour1Instance.addGuide(guide1Instance);
    if (tour2Instance && guide2Instance) await tour2Instance.addGuide(guide2Instance);
    if (tour1Instance && guide2Instance) await tour1Instance.addGuide(guide2Instance); // guide2 also leads tour1
    console.log('✅ Tour-Guide associations created');

    // ─────────────────────────────────────────────────────────────
    // BOOKINGS
    // ─────────────────────────────────────────────────────────────
    const booking1Id = uuidv4();
    const booking2Id = uuidv4();
    const booking3Id = uuidv4();
    const booking4Id = uuidv4();

    const bookings = [
      {
        id: booking1Id, user_id: customer1Id, booking_type: 'hotel', hotel_id: hotel1Id,
        start_date: '2026-07-10', end_date: '2026-07-13',
        adults: 2, children: 1,
        unit_price: 3500000, subtotal: 10500000, discount_amount: 500000, tax_amount: 1000000, total_price: 11000000,
        status: 'confirmed', payment_status: 'paid', payment_method: 'vnpay', paid_at: now,
        contact_name: 'Hoàng Anh Dũng', contact_email: 'dung.customer@gmail.com', contact_phone: '0945678901',
        special_requests: 'Phòng view sông, tầng cao.',
      },
      {
        id: booking2Id, user_id: customer2Id, booking_type: 'tour', tour_id: tour1Id,
        start_date: '2026-08-01', end_date: '2026-08-05',
        adults: 2, children: 0,
        unit_price: 8500000, subtotal: 17000000, discount_amount: 0, tax_amount: 1700000, total_price: 18700000,
        status: 'confirmed', payment_status: 'paid', payment_method: 'bank_transfer', paid_at: now,
        contact_name: 'Vũ Thị Lan', contact_email: 'lan.customer@gmail.com', contact_phone: '0956789012',
      },
      {
        id: booking3Id, user_id: customer3Id, booking_type: 'guide', guide_id: guide1Id,
        start_date: '2026-07-20', end_date: '2026-07-22',
        adults: 4, children: 2,
        unit_price: 1500000, subtotal: 3000000, discount_amount: 0, tax_amount: 300000, total_price: 3300000,
        status: 'pending', payment_status: 'unpaid',
        contact_name: 'Đỗ Quang Minh', contact_email: 'minh.customer@gmail.com', contact_phone: '0967890123',
        special_requests: 'Cần HDV nói tiếng Pháp cho nhóm bạn quốc tế.',
      },
      {
        id: booking4Id, user_id: customer1Id, booking_type: 'tour', tour_id: tour6Id,
        start_date: '2026-06-15', end_date: '2026-06-15',
        adults: 2, children: 0,
        unit_price: 950000, subtotal: 1900000, discount_amount: 0, tax_amount: 190000, total_price: 2090000,
        status: 'completed', payment_status: 'paid', payment_method: 'cash', paid_at: now,
        contact_name: 'Hoàng Anh Dũng', contact_email: 'dung.customer@gmail.com', contact_phone: '0945678901',
      },
    ];

    await Booking.bulkCreate(bookings, { individualHooks: true });
    console.log(`✅ ${bookings.length} bookings created`);

    // ─────────────────────────────────────────────────────────────
    // REVIEWS (for completed booking)
    // ─────────────────────────────────────────────────────────────
    const reviews = [
      {
        id: uuidv4(), user_id: customer1Id, booking_id: booking4Id,
        review_type: 'tour', tour_id: tour6Id,
        rating: 5, title: 'Trải nghiệm tuyệt vời!',
        comment: 'Food tour rất đáng giá! HDV vui tính, am hiểu, dẫn đến những quán ngon nhất. Phở Hòa và bánh mì Huỳnh Hoa là highlight. Chắc chắn sẽ giới thiệu bạn bè.',
        cleanliness_rating: 4, service_rating: 5, value_rating: 5, location_rating: 5,
        is_verified: true, helpful_count: 12,
      },
      {
        id: uuidv4(), user_id: customer1Id, booking_id: booking1Id,
        review_type: 'hotel', hotel_id: hotel1Id,
        rating: 5, title: 'Khách sạn xứng đáng 5 sao',
        comment: 'Phòng rộng rãi, sạch sẽ, view sông tuyệt đẹp. Nhân viên nhiệt tình, buffet sáng đa dạng. Hồ bơi trên tầng thượng rất đẹp.',
        cleanliness_rating: 5, service_rating: 5, value_rating: 4, location_rating: 5,
        is_verified: true, helpful_count: 8,
        reply: 'Cảm ơn anh Dũng đã đánh giá! Chúng tôi rất vui khi anh có trải nghiệm tốt. Hẹn gặp lại!',
        replied_at: now,
      },
    ];

    await Review.bulkCreate(reviews);
    console.log(`✅ ${reviews.length} reviews created`);

    // ─────────────────────────────────────────────────────────────
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   ✅ Seed completed successfully!        ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('\n📋 Test Accounts:');
    console.log('┌────────────────────────────────┬──────────────┬────────────────┐');
    console.log('│ Email                          │ Role         │ Password       │');
    console.log('├────────────────────────────────┼──────────────┼────────────────┤');
    console.log('│ admin@travelbook.vn            │ admin        │ Password123!   │');
    console.log('│ hung.hotel@gmail.com           │ hotel_owner  │ Password123!   │');
    console.log('│ mai.hotel@gmail.com            │ hotel_owner  │ Password123!   │');
    console.log('│ tuan.guide@gmail.com           │ guide        │ Password123!   │');
    console.log('│ ha.guide@gmail.com             │ guide        │ Password123!   │');
    console.log('│ dung.customer@gmail.com        │ customer     │ Password123!   │');
    console.log('│ lan.customer@gmail.com         │ customer     │ Password123!   │');
    console.log('│ minh.customer@gmail.com        │ customer     │ Password123!   │');
    console.log('└────────────────────────────────┴──────────────┴────────────────┘\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await sequelize.close();
    process.exit(1);
  }
}

seed();

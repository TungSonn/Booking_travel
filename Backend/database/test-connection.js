/**
 * Database Connection Test
 * Kiểm tra kết nối đến MySQL và hiển thị thông tin.
 *
 * Usage: node database/test-connection.js
 */
require('dotenv').config();

async function testConnection() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   TravelBook – Database Connection Test  ║');
  console.log('╚══════════════════════════════════════════╝\n');

  console.log('📋 Config:');
  console.log(`   Host:     ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port:     ${process.env.DB_PORT || 3306}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User:     ${process.env.DB_USER}`);
  console.log(`   Password: ${'*'.repeat((process.env.DB_PASSWORD || '').length)}\n`);

  try {
    const { sequelize, User, Hotel, Tour, Guide, Booking, Review } = require('../src/models');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connection: SUCCESS\n');

    // Check MySQL version
    const [[versionResult]] = await sequelize.query('SELECT VERSION() as version');
    console.log(`📌 MySQL Version: ${versionResult.version}`);

    // Check database charset
    const [[charsetResult]] = await sequelize.query(
      `SELECT DEFAULT_CHARACTER_SET_NAME as charset, DEFAULT_COLLATION_NAME as collation 
       FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME}'`
    );
    if (charsetResult) {
      console.log(`📌 Charset: ${charsetResult.charset} (${charsetResult.collation})`);
    }

    // List tables
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, CREATE_TIME 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
       ORDER BY TABLE_NAME`
    );

    if (tables.length === 0) {
      console.log('\n⚠️  No tables found. Run "npm run migrate" to create tables.');
    } else {
      console.log(`\n📊 Tables (${tables.length}):`);
      console.table(tables.map(t => ({
        Table: t.TABLE_NAME,
        Rows: t.TABLE_ROWS || 0,
        Size: `${((t.DATA_LENGTH || 0) / 1024).toFixed(1)} KB`,
      })));
    }

    // Count records per model
    if (tables.length > 0) {
      try {
        const counts = {
          Users: await User.count(),
          Hotels: await Hotel.count(),
          Tours: await Tour.count(),
          Guides: await Guide.count(),
          Bookings: await Booking.count(),
          Reviews: await Review.count(),
        };
        console.log('📊 Record counts:');
        console.table(counts);
      } catch {
        // Tables exist but might not be synced
      }
    }

    await sequelize.close();
    console.log('✅ Test complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection FAILED!\n');
    console.error('Error:', error.message);

    if (error.original) {
      const code = error.original.code;
      console.error(`\n💡 Troubleshooting (${code}):`);

      switch (code) {
        case 'ER_ACCESS_DENIED_ERROR':
          console.error('   → Sai tên user hoặc mật khẩu MySQL.');
          console.error('   → Kiểm tra DB_USER và DB_PASSWORD trong file .env');
          break;
        case 'ECONNREFUSED':
          console.error('   → MySQL server chưa chạy.');
          console.error('   → Chạy: net start MySQL hoặc brew services start mysql');
          break;
        case 'ER_BAD_DB_ERROR':
          console.error('   → Database chưa tồn tại.');
          console.error('   → Chạy: npm run migrate');
          break;
        case 'ETIMEDOUT':
          console.error('   → Không thể kết nối đến host.');
          console.error('   → Kiểm tra DB_HOST và DB_PORT trong file .env');
          break;
        default:
          console.error('   → Kiểm tra lại thông tin kết nối trong file .env');
      }
    }
    console.log('');
    process.exit(1);
  }
}

testConnection();

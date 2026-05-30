/**
 * Migration Runner
 * Tạo database và sync tất cả bảng từ Sequelize models.
 *
 * Usage:
 *   node database/migrations/run.js          → sync (alter: true)
 *   node database/migrations/run.js --force  → drop & recreate tất cả bảng
 *   node database/migrations/run.js --fresh  → drop DB, tạo lại, sync, rồi seed
 */
require('dotenv').config();
const { Sequelize } = require('sequelize');
const logger = require('../../src/utils/logger');

const DB_NAME = process.env.DB_NAME || 'booking_travel_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

const args = process.argv.slice(2);
const isForce = args.includes('--force');
const isFresh = args.includes('--fresh');

async function ensureDatabaseExists() {
  // Connect without DB name to create the database if needed
  const rootSeq = new Sequelize('', DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });

  try {
    await rootSeq.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    logger.info(`✅ Database "${DB_NAME}" ensured`);
  } finally {
    await rootSeq.close();
  }
}

async function dropDatabaseIfFresh() {
  if (!isFresh) return;

  const rootSeq = new Sequelize('', DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });

  try {
    await rootSeq.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
    logger.info(`🗑️  Database "${DB_NAME}" dropped (--fresh)`);
    await rootSeq.query(
      `CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    logger.info(`✅ Database "${DB_NAME}" re-created`);
  } finally {
    await rootSeq.close();
  }
}

async function runMigration() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   TravelBook – Database Migration        ║');
  console.log('╚══════════════════════════════════════════╝\n');

  try {
    // Step 1: Handle fresh mode
    if (isFresh) {
      await dropDatabaseIfFresh();
    }

    // Step 2: Ensure DB exists
    await ensureDatabaseExists();

    // Step 3: Load all models (triggers association setup)
    const { sequelize, User, Hotel, Tour, Guide, Booking, Review } = require('../../src/models');

    // Step 4: Test connection
    await sequelize.authenticate();
    logger.info('✅ Database connection established');

    // Step 5: Sync
    const syncOption = isForce || isFresh ? { force: true } : { alter: true };
    const modeLabel = isForce || isFresh ? 'FORCE (drop & recreate)' : 'ALTER (safe update)';

    logger.info(`🔄 Syncing models... Mode: ${modeLabel}`);
    await sequelize.sync(syncOption);
    logger.info('✅ All models synced successfully');

    // Step 6: Report tables
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${DB_NAME}' ORDER BY TABLE_NAME;`
    );
    console.log('\n📊 Tables created:');
    console.table(tables);

    // Step 7: Auto-seed if --fresh
    if (isFresh) {
      logger.info('🌱 Running seeder (--fresh mode)...');
      require('../seeders/seed');
    } else {
      await sequelize.close();
      logger.info('🏁 Migration complete!');
      process.exit(0);
    }
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

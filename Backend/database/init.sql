-- ================================================================
-- TravelBook – Database Initialization Script
-- MySQL 8.0+ | UTF8MB4
-- ================================================================
-- Usage:
--   mysql -u root -p < database/init.sql
-- ================================================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS `booking_travel_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `booking_travel_db`;

-- ================================================================
-- 1. USERS
-- ================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`                     CHAR(36)     NOT NULL,
  `full_name`              VARCHAR(100) NOT NULL,
  `email`                  VARCHAR(150) NOT NULL,
  `password`               VARCHAR(255) NOT NULL,
  `phone`                  VARCHAR(20)      DEFAULT NULL,
  `avatar`                 VARCHAR(255)     DEFAULT NULL,
  `role`                   ENUM('customer','guide','hotel_owner','admin')
                                            DEFAULT 'customer',
  `is_active`              TINYINT(1)       DEFAULT 1,
  `email_verified`         TINYINT(1)       DEFAULT 0,
  `email_verify_token`     VARCHAR(255)     DEFAULT NULL,
  `reset_password_token`   VARCHAR(255)     DEFAULT NULL,
  `reset_password_expires` DATETIME         DEFAULT NULL,
  `last_login`             DATETIME         DEFAULT NULL,
  `created_at`             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`             DATETIME         DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 2. HOTELS
-- ================================================================
CREATE TABLE IF NOT EXISTS `hotels` (
  `id`              CHAR(36)       NOT NULL,
  `owner_id`        CHAR(36)       NOT NULL,
  `name`            VARCHAR(200)   NOT NULL,
  `slug`            VARCHAR(250)       DEFAULT NULL,
  `description`     TEXT               DEFAULT NULL,
  `address`         VARCHAR(255)   NOT NULL,
  `city`            VARCHAR(100)   NOT NULL,
  `province`        VARCHAR(100)   NOT NULL,
  `country`         VARCHAR(100)       DEFAULT 'Vietnam',
  `latitude`        DECIMAL(10,8)      DEFAULT NULL,
  `longitude`       DECIMAL(11,8)      DEFAULT NULL,
  `star_rating`     TINYINT            DEFAULT NULL,
  `price_per_night` DECIMAL(12,2)  NOT NULL,
  `currency`        VARCHAR(10)        DEFAULT 'VND',
  `thumbnail`       VARCHAR(255)       DEFAULT NULL,
  `images`          JSON               DEFAULT NULL,
  `amenities`       JSON               DEFAULT NULL,
  `total_rooms`     INT                DEFAULT 1,
  `available_rooms` INT                DEFAULT 1,
  `check_in_time`   VARCHAR(10)        DEFAULT '14:00',
  `check_out_time`  VARCHAR(10)        DEFAULT '12:00',
  `is_active`       TINYINT(1)         DEFAULT 1,
  `is_verified`     TINYINT(1)         DEFAULT 0,
  `avg_rating`      DECIMAL(3,2)       DEFAULT 0.00,
  `total_reviews`   INT                DEFAULT 0,
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`      DATETIME           DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_hotels_slug` (`slug`),
  KEY `idx_hotels_owner`    (`owner_id`),
  KEY `idx_hotels_city`     (`city`),
  KEY `idx_hotels_star`     (`star_rating`),
  KEY `idx_hotels_price`    (`price_per_night`),
  KEY `idx_hotels_verified` (`is_verified`),
  CONSTRAINT `fk_hotels_owner` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 3. TOURS
-- ================================================================
CREATE TABLE IF NOT EXISTS `tours` (
  `id`               CHAR(36)       NOT NULL,
  `created_by`       CHAR(36)       NOT NULL,
  `name`             VARCHAR(200)   NOT NULL,
  `slug`             VARCHAR(250)       DEFAULT NULL,
  `description`      TEXT               DEFAULT NULL,
  `highlights`       JSON               DEFAULT NULL,
  `itinerary`        JSON               DEFAULT NULL,
  `includes`         JSON               DEFAULT NULL,
  `excludes`         JSON               DEFAULT NULL,
  `destination`      VARCHAR(150)   NOT NULL,
  `departure_city`   VARCHAR(100)   NOT NULL,
  `duration_days`    INT            NOT NULL,
  `duration_nights`  INT            NOT NULL,
  `max_group_size`   INT                DEFAULT 20,
  `min_group_size`   INT                DEFAULT 1,
  `price_per_person` DECIMAL(12,2)  NOT NULL,
  `price_child`      DECIMAL(12,2)      DEFAULT NULL,
  `currency`         VARCHAR(10)        DEFAULT 'VND',
  `category`         ENUM('adventure','cultural','beach','city','nature','luxury','budget')
                                        DEFAULT 'cultural',
  `difficulty`       ENUM('easy','moderate','challenging')
                                        DEFAULT 'easy',
  `thumbnail`        VARCHAR(255)       DEFAULT NULL,
  `images`           JSON               DEFAULT NULL,
  `is_active`        TINYINT(1)         DEFAULT 1,
  `is_featured`      TINYINT(1)         DEFAULT 0,
  `avg_rating`       DECIMAL(3,2)       DEFAULT 0.00,
  `total_reviews`    INT                DEFAULT 0,
  `total_bookings`   INT                DEFAULT 0,
  `created_at`       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`       DATETIME           DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tours_slug` (`slug`),
  KEY `idx_tours_creator`     (`created_by`),
  KEY `idx_tours_destination` (`destination`),
  KEY `idx_tours_category`    (`category`),
  KEY `idx_tours_featured`    (`is_featured`),
  KEY `idx_tours_price`       (`price_per_person`),
  CONSTRAINT `fk_tours_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 4. GUIDES
-- ================================================================
CREATE TABLE IF NOT EXISTS `guides` (
  `id`                  CHAR(36)       NOT NULL,
  `user_id`             CHAR(36)       NOT NULL,
  `bio`                 TEXT               DEFAULT NULL,
  `languages`           JSON               DEFAULT NULL,
  `specialties`         JSON               DEFAULT NULL,
  `areas`               JSON               DEFAULT NULL,
  `price_per_day`       DECIMAL(12,2)  NOT NULL,
  `price_per_half_day`  DECIMAL(12,2)      DEFAULT NULL,
  `currency`            VARCHAR(10)        DEFAULT 'VND',
  `years_experience`    INT                DEFAULT 0,
  `license_number`      VARCHAR(100)       DEFAULT NULL,
  `license_image`       VARCHAR(255)       DEFAULT NULL,
  `gallery`             JSON               DEFAULT NULL,
  `available_days`      JSON               DEFAULT NULL,
  `max_group_size`      INT                DEFAULT 10,
  `is_active`           TINYINT(1)         DEFAULT 1,
  `is_verified`         TINYINT(1)         DEFAULT 0,
  `avg_rating`          DECIMAL(3,2)       DEFAULT 0.00,
  `total_reviews`       INT                DEFAULT 0,
  `total_tours_guided`  INT                DEFAULT 0,
  `created_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`          DATETIME           DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_guides_user` (`user_id`),
  KEY `idx_guides_verified` (`is_verified`),
  KEY `idx_guides_price`    (`price_per_day`),
  CONSTRAINT `fk_guides_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 5. TOUR_GUIDES (Many-to-Many pivot)
-- ================================================================
CREATE TABLE IF NOT EXISTS `tour_guides` (
  `tour_id`    CHAR(36) NOT NULL,
  `guide_id`   CHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tour_id`, `guide_id`),
  KEY `idx_tg_guide` (`guide_id`),
  CONSTRAINT `fk_tg_tour`  FOREIGN KEY (`tour_id`)  REFERENCES `tours`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tg_guide` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 6. BOOKINGS
-- ================================================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id`                   CHAR(36)       NOT NULL,
  `booking_code`         VARCHAR(20)        DEFAULT NULL,
  `user_id`              CHAR(36)       NOT NULL,
  `booking_type`         ENUM('hotel','tour','guide') NOT NULL,
  `hotel_id`             CHAR(36)           DEFAULT NULL,
  `tour_id`              CHAR(36)           DEFAULT NULL,
  `guide_id`             CHAR(36)           DEFAULT NULL,
  `start_date`           DATE           NOT NULL,
  `end_date`             DATE           NOT NULL,
  `adults`               INT                DEFAULT 1,
  `children`             INT                DEFAULT 0,
  `unit_price`           DECIMAL(12,2)  NOT NULL,
  `subtotal`             DECIMAL(12,2)  NOT NULL,
  `discount_amount`      DECIMAL(12,2)      DEFAULT 0.00,
  `tax_amount`           DECIMAL(12,2)      DEFAULT 0.00,
  `total_price`          DECIMAL(12,2)  NOT NULL,
  `currency`             VARCHAR(10)        DEFAULT 'VND',
  `status`               ENUM('pending','confirmed','completed','cancelled','refunded')
                                            DEFAULT 'pending',
  `payment_status`       ENUM('unpaid','paid','partially_paid','refunded')
                                            DEFAULT 'unpaid',
  `payment_method`       ENUM('cash','bank_transfer','vnpay','momo','credit_card')
                                            DEFAULT NULL,
  `payment_id`           VARCHAR(255)       DEFAULT NULL,
  `paid_at`              DATETIME           DEFAULT NULL,
  `special_requests`     TEXT               DEFAULT NULL,
  `cancellation_reason`  TEXT               DEFAULT NULL,
  `cancelled_at`         DATETIME           DEFAULT NULL,
  `contact_name`         VARCHAR(100)   NOT NULL,
  `contact_email`        VARCHAR(150)   NOT NULL,
  `contact_phone`        VARCHAR(20)    NOT NULL,
  `created_at`           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`           DATETIME           DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bookings_code` (`booking_code`),
  KEY `idx_bookings_user`   (`user_id`),
  KEY `idx_bookings_type`   (`booking_type`),
  KEY `idx_bookings_status` (`status`),
  KEY `idx_bookings_hotel`  (`hotel_id`),
  KEY `idx_bookings_tour`   (`tour_id`),
  KEY `idx_bookings_guide`  (`guide_id`),
  KEY `idx_bookings_dates`  (`start_date`, `end_date`),
  CONSTRAINT `fk_bookings_user`  FOREIGN KEY (`user_id`)  REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_tour`  FOREIGN KEY (`tour_id`)  REFERENCES `tours`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_guide` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 7. REVIEWS
-- ================================================================
CREATE TABLE IF NOT EXISTS `reviews` (
  `id`                 CHAR(36)     NOT NULL,
  `user_id`            CHAR(36)     NOT NULL,
  `booking_id`         CHAR(36)     NOT NULL,
  `review_type`        ENUM('hotel','tour','guide') NOT NULL,
  `hotel_id`           CHAR(36)         DEFAULT NULL,
  `tour_id`            CHAR(36)         DEFAULT NULL,
  `guide_id`           CHAR(36)         DEFAULT NULL,
  `rating`             TINYINT      NOT NULL,
  `title`              VARCHAR(200)     DEFAULT NULL,
  `comment`            TEXT         NOT NULL,
  `images`             JSON             DEFAULT NULL,
  `cleanliness_rating` TINYINT          DEFAULT NULL,
  `service_rating`     TINYINT          DEFAULT NULL,
  `value_rating`       TINYINT          DEFAULT NULL,
  `location_rating`    TINYINT          DEFAULT NULL,
  `is_verified`        TINYINT(1)       DEFAULT 0,
  `helpful_count`      INT              DEFAULT 0,
  `reply`              TEXT             DEFAULT NULL,
  `replied_at`         DATETIME         DEFAULT NULL,
  `created_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`         DATETIME         DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_user`    (`user_id`),
  KEY `idx_reviews_booking` (`booking_id`),
  KEY `idx_reviews_type`    (`review_type`),
  KEY `idx_reviews_hotel`   (`hotel_id`),
  KEY `idx_reviews_tour`    (`tour_id`),
  KEY `idx_reviews_guide`   (`guide_id`),
  KEY `idx_reviews_rating`  (`rating`),
  CONSTRAINT `fk_reviews_user`    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_hotel`   FOREIGN KEY (`hotel_id`)   REFERENCES `hotels`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_tour`    FOREIGN KEY (`tour_id`)    REFERENCES `tours`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_guide`   FOREIGN KEY (`guide_id`)   REFERENCES `guides`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- DONE
-- ================================================================
SELECT '✅ Database booking_travel_db created successfully!' AS status;
SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'booking_travel_db';

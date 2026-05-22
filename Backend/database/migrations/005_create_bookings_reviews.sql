-- ============================================================
-- Migration 005: Bookings Table
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id                  CHAR(36)      NOT NULL PRIMARY KEY,
  booking_code        VARCHAR(20)   NOT NULL UNIQUE,
  user_id             CHAR(36)      NOT NULL,
  booking_type        ENUM('hotel','tour','guide') NOT NULL,
  hotel_id            CHAR(36)      NULL,
  tour_id             CHAR(36)      NULL,
  guide_id            CHAR(36)      NULL,
  start_date          DATE          NOT NULL,
  end_date            DATE          NOT NULL,
  adults              INT           NOT NULL DEFAULT 1,
  children            INT           NOT NULL DEFAULT 0,
  unit_price          DECIMAL(12,2) NOT NULL,
  subtotal            DECIMAL(12,2) NOT NULL,
  discount_amount     DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount          DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_price         DECIMAL(12,2) NOT NULL,
  currency            VARCHAR(10)   NOT NULL DEFAULT 'VND',
  status              ENUM('pending','confirmed','completed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  payment_status      ENUM('unpaid','paid','partially_paid','refunded') NOT NULL DEFAULT 'unpaid',
  payment_method      ENUM('cash','bank_transfer','vnpay','momo','credit_card') NULL,
  payment_id          VARCHAR(255)  NULL,
  paid_at             DATETIME      NULL,
  special_requests    TEXT          NULL,
  cancellation_reason TEXT          NULL,
  cancelled_at        DATETIME      NULL,
  contact_name        VARCHAR(100)  NOT NULL,
  contact_email       VARCHAR(150)  NOT NULL,
  contact_phone       VARCHAR(20)   NOT NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          DATETIME      NULL,
  CONSTRAINT fk_booking_user  FOREIGN KEY (user_id)  REFERENCES users(id),
  CONSTRAINT fk_booking_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id),
  CONSTRAINT fk_booking_tour  FOREIGN KEY (tour_id)  REFERENCES tours(id),
  CONSTRAINT fk_booking_guide FOREIGN KEY (guide_id) REFERENCES guides(id),
  INDEX idx_user_id      (user_id),
  INDEX idx_status       (status),
  INDEX idx_booking_type (booking_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Migration 006: Reviews Table
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                  CHAR(36)    NOT NULL PRIMARY KEY,
  user_id             CHAR(36)    NOT NULL,
  booking_id          CHAR(36)    NOT NULL,
  review_type         ENUM('hotel','tour','guide') NOT NULL,
  hotel_id            CHAR(36)    NULL,
  tour_id             CHAR(36)    NULL,
  guide_id            CHAR(36)    NULL,
  rating              TINYINT     NOT NULL,
  title               VARCHAR(200) NULL,
  comment             TEXT        NOT NULL,
  images              JSON        NULL,
  cleanliness_rating  TINYINT     NULL,
  service_rating      TINYINT     NULL,
  value_rating        TINYINT     NULL,
  location_rating     TINYINT     NULL,
  is_verified         TINYINT(1)  NOT NULL DEFAULT 0,
  helpful_count       INT         NOT NULL DEFAULT 0,
  reply               TEXT        NULL,
  replied_at          DATETIME    NULL,
  created_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          DATETIME    NULL,
  CONSTRAINT fk_review_user    FOREIGN KEY (user_id)    REFERENCES users(id),
  CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
  INDEX idx_hotel_id (hotel_id),
  INDEX idx_tour_id  (tour_id),
  INDEX idx_guide_id (guide_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Migration 007: Tour Guides (pivot)
-- ============================================================
CREATE TABLE IF NOT EXISTS tour_guides (
  tour_id  CHAR(36) NOT NULL,
  guide_id CHAR(36) NOT NULL,
  PRIMARY KEY (tour_id, guide_id),
  CONSTRAINT fk_tg_tour  FOREIGN KEY (tour_id)  REFERENCES tours(id)  ON DELETE CASCADE,
  CONSTRAINT fk_tg_guide FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

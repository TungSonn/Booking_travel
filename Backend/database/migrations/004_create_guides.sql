-- ============================================================
-- Migration 004: Guides Table
-- ============================================================
CREATE TABLE IF NOT EXISTS guides (
  id                 CHAR(36)      NOT NULL PRIMARY KEY,
  user_id            CHAR(36)      NOT NULL UNIQUE,
  bio                TEXT          NULL,
  languages          JSON          NULL,
  specialties        JSON          NULL,
  areas              JSON          NULL,
  price_per_day      DECIMAL(12,2) NOT NULL,
  price_per_half_day DECIMAL(12,2) NULL,
  currency           VARCHAR(10)   NOT NULL DEFAULT 'VND',
  years_experience   INT           NOT NULL DEFAULT 0,
  license_number     VARCHAR(100)  NULL,
  license_image      VARCHAR(255)  NULL,
  gallery            JSON          NULL,
  available_days     JSON          NULL,
  max_group_size     INT           NOT NULL DEFAULT 10,
  is_active          TINYINT(1)    NOT NULL DEFAULT 1,
  is_verified        TINYINT(1)    NOT NULL DEFAULT 0,
  avg_rating         DECIMAL(3,2)  NOT NULL DEFAULT 0,
  total_reviews      INT           NOT NULL DEFAULT 0,
  total_tours_guided INT           NOT NULL DEFAULT 0,
  created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at         DATETIME      NULL,
  CONSTRAINT fk_guide_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

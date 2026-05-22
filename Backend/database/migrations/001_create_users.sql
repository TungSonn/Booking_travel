-- ============================================================
-- Migration 001: Users Table
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                    CHAR(36)        NOT NULL PRIMARY KEY,
  full_name             VARCHAR(100)    NOT NULL,
  email                 VARCHAR(150)    NOT NULL UNIQUE,
  password              VARCHAR(255)    NOT NULL,
  phone                 VARCHAR(20)     NULL,
  avatar                VARCHAR(255)    NULL,
  role                  ENUM('customer','guide','hotel_owner','admin') NOT NULL DEFAULT 'customer',
  is_active             TINYINT(1)      NOT NULL DEFAULT 1,
  email_verified        TINYINT(1)      NOT NULL DEFAULT 0,
  email_verify_token    VARCHAR(255)    NULL,
  reset_password_token  VARCHAR(255)    NULL,
  reset_password_expires DATETIME       NULL,
  last_login            DATETIME        NULL,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at            DATETIME        NULL,
  INDEX idx_email       (email),
  INDEX idx_role        (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

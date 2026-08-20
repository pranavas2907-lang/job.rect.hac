CREATE DATABASE IF NOT EXISTS jobnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jobnest;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NULL,
  headline VARCHAR(255) NOT NULL,
  location VARCHAR(160) NULL,
  about TEXT NULL,
  skills JSON NULL,
  resume_name VARCHAR(255) NULL,
  resume_path VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email),
  KEY users_created_at_index (created_at)
);

CREATE TABLE IF NOT EXISTS applications (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  job_id VARCHAR(80) NOT NULL,
  status ENUM('Applied', 'In Review', 'Shortlisted', 'Interview', 'Rejected', 'Offer') NOT NULL DEFAULT 'Applied',
  resume_name VARCHAR(255) NULL,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY applications_user_job_unique (user_id, job_id),
  KEY applications_status_index (status),
  CONSTRAINT applications_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Example query for the owner:
-- SELECT id, full_name, email, phone, headline, location, resume_name, created_at FROM users ORDER BY created_at DESC;
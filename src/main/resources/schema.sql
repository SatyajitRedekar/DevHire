CREATE DATABASE IF NOT EXISTS devhire;
USE devhire;

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS seeker_profile;
DROP TABLE IF EXISTS recruiter_profile;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('SEEKER','RECRUITER','ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recruiter_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(150),
    company_website VARCHAR(255),
    industry VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE seeker_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    headline VARCHAR(150),
    skills VARCHAR(500),
    experience_years INT,
    resume_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT NULL,
    company VARCHAR(150) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    skills_required VARCHAR(500),
    experience VARCHAR(100),
    location VARCHAR(100),
    job_type ENUM('FULL_TIME','INTERNSHIP','CONTRACT') NOT NULL DEFAULT 'FULL_TIME',
    salary_range VARCHAR(50),
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('OPEN','CLOSED') DEFAULT 'OPEN',
    is_external BOOLEAN DEFAULT FALSE,
    external_id VARCHAR(255) UNIQUE,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    seeker_id BIGINT NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('APPLIED','SHORTLISTED','REJECTED','HIRED') DEFAULT 'APPLIED',
    cover_note TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

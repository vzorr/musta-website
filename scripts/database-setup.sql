-- Complete Database Setup Script for myUsta
-- Run this script as postgres superuser:
-- psql -U postgres -f complete-database-setup.sql

-- ========================================
-- DATABASE AND USER SETUP
-- ========================================

-- Drop database if exists (comment out if you want to keep existing data)
DROP DATABASE IF EXISTS myusta_website;

-- Create database
CREATE DATABASE myusta_website;

-- Connect to the new database
\c myusta_website

-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_user
      WHERE usename = 'myusta_website_user') THEN
      CREATE USER myusta_website_user WITH PASSWORD 'myusta_secure_password_2024';
   END IF;
END
$do$;

-- ========================================
-- DROP EXISTING TYPES IF THEY EXIST
-- ========================================
DROP TYPE IF EXISTS status_type CASCADE;
DROP TYPE IF EXISTS language_type CASCADE;

-- ========================================
-- CREATE ENUM TYPES
-- ========================================
CREATE TYPE language_type AS ENUM ('sq', 'en');
CREATE TYPE status_type AS ENUM ('pending', 'processed', 'resolved', 'approved', 'rejected', 'active', 'inactive');

-- ========================================
-- CATEGORIES TABLE WITH TRANSLATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_sq VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_sq TEXT,
    icon VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (code, name_en, name_sq, description_en, description_sq, display_order) VALUES
('plumber', 'Plumber', 'Hidraulik', 'Plumbing and water system services', 'Shërbime hidraulike dhe sistemesh uji', 1),
('electrician', 'Electrician', 'Elektricist', 'Electrical installation and repair services', 'Shërbime instalimi dhe riparimi elektrik', 2),
('painter', 'Painter', 'Bojaxhi', 'Painting and decoration services', 'Shërbime bojatisje dhe dekorimi', 3),
('carpenter', 'Carpenter', 'Marangoz', 'Woodworking and carpentry services', 'Shërbime druri dhe marangozi', 4),
('tiler', 'Tiler', 'Pllakështrues', 'Tile installation and repair', 'Instalim dhe riparim pllakash', 5),
('mason', 'Mason', 'Murator', 'Masonry and construction services', 'Shërbime muratorie dhe ndërtimi', 6),
('woodworker', 'Woodworker', 'Zdrukthëtar', 'Wood crafting and furniture services', 'Shërbime druri dhe mobilierie', 7),
('cleaner', 'Cleaner', 'Pastrues', 'Cleaning and maintenance services', 'Shërbime pastrimi dhe mirëmbajtjeje', 8),
('gardener', 'Gardener', 'Kopshtar', 'Gardening and landscaping services', 'Shërbime kopshtarie dhe peizazhi', 9),
('other', 'Other', 'Tjetër', 'Other professional services', 'Shërbime të tjera profesionale', 99);

-- ========================================
-- LOCATIONS TABLE WITH TRANSLATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_sq VARCHAR(100) NOT NULL,
    region_en VARCHAR(100),
    region_sq VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default locations
INSERT INTO locations (code, name_en, name_sq, region_en, region_sq, postal_code, display_order) VALUES
('tirana', 'Tirana', 'Tiranë', 'Central Albania', 'Shqipëria Qendrore', '1001', 1),
('durres', 'Durres', 'Durrës', 'Central Albania', 'Shqipëria Qendrore', '2001', 2),
('vlore', 'Vlore', 'Vlorë', 'Southern Albania', 'Shqipëria Jugore', '9401', 3),
('shkoder', 'Shkoder', 'Shkodër', 'Northern Albania', 'Shqipëria Veriore', '4001', 4),
('elbasan', 'Elbasan', 'Elbasan', 'Central Albania', 'Shqipëria Qendrore', '3001', 5),
('korce', 'Korce', 'Korçë', 'Southeastern Albania', 'Shqipëria Juglindore', '7001', 6),
('fier', 'Fier', 'Fier', 'Southwestern Albania', 'Shqipëria Jugperëndimore', '9301', 7),
('berat', 'Berat', 'Berat', 'Central Albania', 'Shqipëria Qendrore', '5001', 8),
('lushnje', 'Lushnje', 'Lushnjë', 'Central Albania', 'Shqipëria Qendrore', '9001', 9),
('pogradec', 'Pogradec', 'Pogradec', 'Southeastern Albania', 'Shqipëria Juglindore', '7301', 10),
('gjirokaster', 'Gjirokaster', 'Gjirokastër', 'Southern Albania', 'Shqipëria Jugore', '6001', 11),
('sarande', 'Sarande', 'Sarandë', 'Southern Albania', 'Shqipëria Jugore', '9701', 12),
('lezhe', 'Lezhe', 'Lezhë', 'Northwestern Albania', 'Shqipëria Veriperëndimore', '4501', 13),
('kukes', 'Kukes', 'Kukës', 'Northeastern Albania', 'Shqipëria Verilindore', '8501', 14),
('other', 'Other', 'Tjetër', 'Other Region', 'Rajon Tjetër', NULL, 99);

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    category_id INTEGER REFERENCES categories(id),
    location_id INTEGER REFERENCES locations(id),
    preferred_language language_type DEFAULT 'sq',
    is_usta BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP WITH TIME ZONE,
    status status_type DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- CONTACT SUBMISSIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    language language_type DEFAULT 'sq',
    ip_address VARCHAR(45),
    user_agent TEXT,
    status status_type DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(100),
    notes TEXT
);

-- ========================================
-- WAITLIST TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS waitlist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    location_id INTEGER REFERENCES locations(id),
    language language_type DEFAULT 'sq',
    gdpr_consent BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status status_type DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by VARCHAR(100),
    notes TEXT
);

-- ========================================
-- RECOMMENDATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    recommender_name VARCHAR(100) NOT NULL,
    recommender_email VARCHAR(150),
    recommender_phone VARCHAR(20) NOT NULL,
    usta_name VARCHAR(100),
    usta_email VARCHAR(150),
    usta_phone VARCHAR(20),
    category_id INTEGER REFERENCES categories(id),
    location_id INTEGER REFERENCES locations(id),
    language language_type DEFAULT 'sq',
    is_recommendation BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status status_type DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by VARCHAR(100),
    rejection_reason TEXT,
    notes TEXT,
    source VARCHAR(50) DEFAULT 'website',
    referral_code VARCHAR(20)
);

-- ========================================
-- REGISTRATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    location_id INTEGER REFERENCES locations(id),
    language language_type DEFAULT 'sq',
    gdpr_consent BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status status_type DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by VARCHAR(100),
    notes TEXT
);

-- ========================================
-- EMAIL LOGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    recipient_email VARCHAR(150) NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    subject VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    reference_id INTEGER,
    reference_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- GDPR REQUESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS gdpr_requests (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('access', 'export', 'delete', 'rectify')),
    details TEXT,
    language language_type DEFAULT 'sq',
    ip_address VARCHAR(45),
    status status_type DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_category ON users(category_id);
CREATE INDEX idx_users_location ON users(location_id);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);

CREATE INDEX idx_recommend_recommender_email ON recommendations(recommender_email);
CREATE INDEX idx_recommend_usta_phone ON recommendations(usta_phone);
CREATE INDEX idx_recommend_category ON recommendations(category_id);
CREATE INDEX idx_recommend_location ON recommendations(location_id);
CREATE INDEX idx_recommend_status ON recommendations(status);
CREATE INDEX idx_recommend_created ON recommendations(created_at DESC);

CREATE INDEX idx_registration_email ON registrations(email);
CREATE INDEX idx_registration_phone ON registrations(phone);
CREATE INDEX idx_registration_category ON registrations(category_id);
CREATE INDEX idx_registration_location ON registrations(location_id);
CREATE INDEX idx_registration_status ON registrations(status);
CREATE INDEX idx_registration_created ON registrations(created_at DESC);

CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_phone ON waitlist(phone);
CREATE INDEX idx_waitlist_category ON waitlist(category_id);
CREATE INDEX idx_waitlist_location ON waitlist(location_id);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);

CREATE INDEX idx_email_log_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_log_type ON email_logs(email_type);
CREATE INDEX idx_email_log_reference ON email_logs(reference_type, reference_id);

CREATE INDEX idx_gdpr_email ON gdpr_requests(email);
CREATE INDEX idx_gdpr_type ON gdpr_requests(request_type);
CREATE INDEX idx_gdpr_status ON gdpr_requests(status);

-- ========================================
-- CREATE USEFUL VIEWS
-- ========================================

-- View for pending contacts
CREATE OR REPLACE VIEW pending_contacts AS
SELECT 
    id,
    name,
    email,
    phone,
    subject,
    message,
    language,
    created_at
FROM contact_submissions
WHERE status = 'pending'
ORDER BY created_at DESC;

-- View for pending recommendations with category and location names
CREATE OR REPLACE VIEW pending_recommendations_view AS
SELECT 
    r.id,
    r.recommender_name,
    r.recommender_email,
    r.recommender_phone,
    r.usta_name,
    r.usta_phone,
    c.code as category_code,
    c.name_en as category_name_en,
    c.name_sq as category_name_sq,
    l.code as location_code,
    l.name_en as location_name_en,
    l.name_sq as location_name_sq,
    r.is_recommendation,
    r.created_at
FROM recommendations r
LEFT JOIN categories c ON r.category_id = c.id
LEFT JOIN locations l ON r.location_id = l.id
WHERE r.status = 'pending'
ORDER BY r.created_at DESC;

-- View for registration statistics
CREATE OR REPLACE VIEW registration_statistics AS
SELECT 
    COUNT(*) as total_registrations,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN gdpr_consent = true THEN 1 END) as gdpr_consent_count,
    COUNT(CASE WHEN marketing_consent = true THEN 1 END) as marketing_consent_count
FROM registrations;

-- ========================================
-- GRANT PERMISSIONS TO USER
-- ========================================

-- Grant database connection
GRANT CONNECT ON DATABASE myusta_website TO myusta_website_user;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO myusta_website_user;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myusta_website_user;

-- Grant sequence permissions (for SERIAL columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO myusta_website_user;

-- Grant permissions on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO myusta_website_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO myusta_website_user;

-- ========================================
-- DISPLAY SETUP SUMMARY
-- ========================================
\echo ''
\echo '========================================='
\echo '    DATABASE SETUP COMPLETED'
\echo '========================================='
\echo ''
\echo 'Database: myusta_website'
\echo 'User: myusta_website_user'
\echo 'Password: myusta_secure_password_2024'
\echo ''
\echo 'Tables created:'
\dt
\echo ''
\echo 'Categories count:'
SELECT COUNT(*) as total_categories FROM categories;
\echo ''
\echo 'Locations count:'
SELECT COUNT(*) as total_locations FROM locations;
\echo ''
\echo 'Sample categories:'
SELECT code, name_en, name_sq FROM categories ORDER BY display_order LIMIT 5;
\echo ''
\echo 'Sample locations:'
SELECT code, name_en, name_sq FROM locations ORDER BY display_order LIMIT 5;
\echo ''
\echo 'Connection string for your application:'
\echo 'postgresql://myusta_website_user:myusta_secure_password_2024@localhost:5432/myusta_website'
\echo ''
\echo 'Please change the password for production use!'
\echo ''
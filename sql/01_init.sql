-- ============================================
-- Schéma de base de données Identity Provider
-- ============================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    blocked_until TIMESTAMP,
    last_login TIMESTAMP,
    firebase_uid VARCHAR(255),
    
    CONSTRAINT chk_role CHECK (role IN ('VISITOR', 'USER', 'MANAGER'))
);

-- Table des sessions
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des problèmes de route
CREATE TABLE IF NOT EXISTS road_issues (
    id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NOUVEAU',
    surface_m2 DOUBLE PRECISION,
    budget DOUBLE PRECISION,
    company_name VARCHAR(255),
    photo_url VARCHAR(500),
    reporter_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    firebase_id VARCHAR(255),
    synced_to_firebase BOOLEAN DEFAULT false,
    
    CONSTRAINT chk_status CHECK (status IN ('NOUVEAU', 'EN_COURS', 'TERMINE')),
    CONSTRAINT fk_issue_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_road_issues_reporter_id ON road_issues(reporter_id);
CREATE INDEX IF NOT EXISTS idx_road_issues_status ON road_issues(status);
CREATE INDEX IF NOT EXISTS idx_road_issues_location ON road_issues(latitude, longitude);

-- Commentaires sur les tables
COMMENT ON TABLE users IS 'Table des utilisateurs du système';
COMMENT ON TABLE sessions IS 'Table des sessions utilisateur avec tokens JWT';
COMMENT ON TABLE road_issues IS 'Table des signalements de problèmes de route';

-- Commentaires sur les colonnes importantes
COMMENT ON COLUMN users.role IS 'Rôle: VISITOR, USER, ou MANAGER';
COMMENT ON COLUMN users.is_blocked IS 'Indique si l''utilisateur est bloqué après plusieurs tentatives échouées';
COMMENT ON COLUMN road_issues.status IS 'Statut: NOUVEAU, EN_COURS, ou TERMINE';
COMMENT ON COLUMN road_issues.synced_to_firebase IS 'Indique si les données sont synchronisées avec Firebase';


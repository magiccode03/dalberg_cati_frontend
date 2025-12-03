-- =====================================================
-- Downloads Management System - Database Schema
-- API-Based Download Items Configuration
-- =====================================================

DROP TABLE IF EXISTS cv_fullstack_main.download_tracking;
DROP TABLE IF EXISTS cv_fullstack_main.download_items;

-- =====================================================
-- Main Table: download_items
-- Stores download item configurations that point to API endpoints
-- =====================================================

CREATE TABLE cv_fullstack_main.download_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL COMMENT 'Display title of the download item (e.g., "CAPI Interview Data")',
    description TEXT COMMENT 'Description of what the download contains',
    api_url VARCHAR(500) NOT NULL COMMENT 'API endpoint URL (e.g., "/api/capi/interview/download")',
    api_method ENUM('GET', 'POST', 'PUT', 'DELETE') NOT NULL DEFAULT 'GET' COMMENT 'HTTP method for the API call',
    api_params JSON NULL COMMENT 'Optional parameters as JSON object or string (e.g., {"date":"2025-11-20"} or "date=2025-11-20")',
    type ENUM('CSV', 'EXCEL', 'ZIP', 'JSON', 'PDF', 'OTHER') NOT NULL DEFAULT 'CSV' COMMENT 'File type that will be generated',
    status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = active (visible), 0 = inactive (hidden)',
    sort_order INT DEFAULT 0 COMMENT 'Display order in the list (lower numbers appear first)',
    created_by VARCHAR(36) COMMENT 'User ID who created the item',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Indexes for performance
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_sort_order (sort_order),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_search (title, description),
    
    -- Composite indexes for common queries
    INDEX idx_status_type (status, type),
    INDEX idx_status_sort (status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores download item configurations that point to API endpoints';

-- =====================================================
-- Optional Table: download_tracking
-- Tracks download events for analytics
-- =====================================================

CREATE TABLE cv_fullstack_main.download_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    download_item_id INT NOT NULL COMMENT 'Reference to download_items table',
    user_id VARCHAR(36) COMMENT 'User ID who downloaded (if authenticated)',
    user_role VARCHAR(50) COMMENT 'Role of the user who downloaded',
    ip_address VARCHAR(45) COMMENT 'IP address of the downloader',
    user_agent TEXT COMMENT 'User agent string',
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Download timestamp',
    
    -- Foreign key
    FOREIGN KEY (download_item_id) REFERENCES cv_fullstack_main.download_items(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_download_item_id (download_item_id),
    INDEX idx_user_id (user_id),
    INDEX idx_downloaded_at (downloaded_at),
    INDEX idx_user_role (user_role),
    INDEX idx_item_user (download_item_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks individual download events for analytics';

-- =====================================================
-- Sample Data
-- =====================================================

-- Insert sample download items
INSERT INTO cv_fullstack_main.download_items (title, description, api_url, api_method, api_params, type, status, sort_order) VALUES
('CAPI Interview Data', 'Download CAPI interview data for a specific date', '/api/capi/interview/download', 'GET', '{"date": "2025-11-20"}', 'CSV', 1, 1),
('CATI Survey Data', 'Download CATI survey data for a date range', '/api/cati/survey/download', 'GET', '{"startDate": "2025-11-01", "endDate": "2025-11-30"}', 'EXCEL', 1, 2),
('Monthly Report', 'Generate monthly report in PDF format', '/api/reports/monthly', 'POST', '{"month": "2025-11"}', 'PDF', 1, 3),
('All Interview Data', 'Download all interview data as compressed archive', '/api/interviews/download-all', 'GET', NULL, 'ZIP', 1, 4),
('User Statistics', 'Download user statistics in JSON format', '/api/users/statistics/download', 'GET', NULL, 'JSON', 1, 5),
('Daily Summary Report', 'Generate daily summary report', '/api/reports/daily', 'GET', '{"date": "2025-12-01"}', 'PDF', 1, 6),
('AC Wise Data Export', 'Export Assembly Constituency wise data', '/api/data/ac-wise-export', 'GET', '{"acCode": "001"}', 'CSV', 1, 7),
('QC Report Data', 'Download QC report data', '/api/qc/report/download', 'POST', '{"reportType": "summary", "dateRange": "2025-11"}', 'EXCEL', 1, 8);

-- =====================================================
-- Views for Common Queries
-- =====================================================

-- View for active download items ordered by sort_order
CREATE OR REPLACE VIEW cv_fullstack_main.v_active_download_items AS
SELECT 
    id,
    title,
    description,
    api_url,
    api_method,
    api_params,
    type,
    sort_order,
    created_at,
    updated_at
FROM cv_fullstack_main.download_items
WHERE status = 1
ORDER BY sort_order ASC, created_at DESC;

-- View for download statistics by type
CREATE OR REPLACE VIEW cv_fullstack_main.v_download_stats_by_type AS
SELECT 
    type,
    COUNT(*) AS total_items,
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS active_items,
    SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS inactive_items
FROM cv_fullstack_main.download_items
GROUP BY type
ORDER BY total_items DESC;

-- View for download tracking summary
CREATE OR REPLACE VIEW cv_fullstack_main.v_download_tracking_summary AS
SELECT 
    di.id,
    di.title,
    di.type,
    COUNT(dt.id) AS total_downloads,
    COUNT(DISTINCT dt.user_id) AS unique_downloaders,
    MAX(dt.downloaded_at) AS last_downloaded_at
FROM cv_fullstack_main.download_items di
LEFT JOIN cv_fullstack_main.download_tracking dt ON di.id = dt.download_item_id
WHERE di.status = 1
GROUP BY di.id, di.title, di.type
ORDER BY total_downloads DESC;

-- =====================================================
-- Stored Procedures
-- =====================================================

-- Procedure to track a download
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_track_download(
    IN p_download_item_id INT,
    IN p_user_id VARCHAR(36),
    IN p_user_role VARCHAR(50),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT
)
BEGIN
    -- Insert download tracking record
    INSERT INTO cv_fullstack_main.download_tracking (download_item_id, user_id, user_role, ip_address, user_agent)
    VALUES (p_download_item_id, p_user_id, p_user_role, p_ip_address, p_user_agent);
    
    SELECT LAST_INSERT_ID() AS tracking_id;
END //

DELIMITER ;

-- Procedure to get download statistics
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_get_download_statistics(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_type VARCHAR(20)
)
BEGIN
    SELECT 
        COUNT(DISTINCT di.id) AS total_items,
        SUM(CASE WHEN di.status = 1 THEN 1 ELSE 0 END) AS active_items,
        COUNT(DISTINCT dt.id) AS total_downloads,
        COUNT(DISTINCT dt.user_id) AS unique_downloaders,
        COUNT(DISTINCT di.type) AS type_count
    FROM cv_fullstack_main.download_items di
    LEFT JOIN cv_fullstack_main.download_tracking dt ON di.id = dt.download_item_id
        AND (p_start_date IS NULL OR DATE(dt.downloaded_at) >= p_start_date)
        AND (p_end_date IS NULL OR DATE(dt.downloaded_at) <= p_end_date)
    WHERE (p_type IS NULL OR di.type = p_type)
        AND (p_start_date IS NULL OR DATE(di.created_at) >= p_start_date)
        AND (p_end_date IS NULL OR DATE(di.created_at) <= p_end_date);
END //

DELIMITER ;

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger to update updated_at timestamp
DELIMITER //

CREATE TRIGGER IF NOT EXISTS tr_download_items_update_timestamp
BEFORE UPDATE ON cv_fullstack_main.download_items
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- =====================================================
-- Indexes for Performance (Additional)
-- =====================================================

-- Composite index for filtering active items by type
-- Note: MySQL doesn't support IF NOT EXISTS for CREATE INDEX
-- If index already exists, drop it manually first, or ignore the error if running multiple times
CREATE INDEX idx_download_items_active_type ON cv_fullstack_main.download_items(status, type, sort_order);

-- Index for search queries
-- Note: MySQL doesn't support IF NOT EXISTS for CREATE INDEX
-- If index already exists, drop it manually first, or ignore the error if running multiple times
CREATE INDEX idx_download_items_search ON cv_fullstack_main.download_items(status, created_at DESC);

-- =====================================================
-- Utility Queries
-- =====================================================

-- Query to get all active download items with their API configuration
-- SELECT 
--     id,
--     title,
--     description,
--     JSON_OBJECT(
--         'url', api_url,
--         'method', api_method,
--         'params', api_params
--     ) AS api,
--     type,
--     status,
--     sort_order
-- FROM download_items
-- WHERE status = 1
-- ORDER BY sort_order ASC, created_at DESC;

-- Query to find most downloaded items
-- SELECT 
--     di.title,
--     di.type,
--     COUNT(dt.id) AS download_count
-- FROM download_items di
-- LEFT JOIN download_tracking dt ON di.id = dt.download_item_id
-- WHERE di.status = 1
-- GROUP BY di.id, di.title, di.type
-- ORDER BY download_count DESC
-- LIMIT 10;

-- Query to get download items by type
-- SELECT 
--     type,
--     COUNT(*) AS count,
--     GROUP_CONCAT(title SEPARATOR ', ') AS items
-- FROM download_items
-- WHERE status = 1
-- GROUP BY type
-- ORDER BY count DESC;

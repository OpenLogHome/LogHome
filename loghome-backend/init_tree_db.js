const { query } = require('./sql.js');

async function initDB() {
    console.log("Start initializing database for Tree Plant Refactor...");

    try {
        // 1. Add growth_val to treeplant if not exists
        // We can't easily check column existence in generic SQL without information_schema, 
        // but we can try to add it and catch error if it exists.
        try {
            await query("ALTER TABLE treeplant ADD COLUMN growth_val INT DEFAULT 0;");
            console.log("Added column 'growth_val' to 'treeplant'.");
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("Column 'growth_val' already exists in 'treeplant'.");
            } else {
                console.error("Error adding 'growth_val':", e);
            }
        }

        // 2. Create tree_tasks table
        await query(`
            CREATE TABLE IF NOT EXISTS tree_tasks (
                task_id INT AUTO_INCREMENT PRIMARY KEY,
                task_code VARCHAR(50) UNIQUE NOT NULL,
                task_name VARCHAR(100) NOT NULL,
                task_desc VARCHAR(255),
                task_type ENUM('daily', 'fixed') NOT NULL,
                growth_reward INT NOT NULL,
                icon VARCHAR(255) DEFAULT NULL
            ) DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'tree_tasks' checked/created.");

        // 3. Create user_tree_tasks table
        // user_id type: Assuming VARCHAR(50) or INT based on typical usage. 
        // Since I don't see the user table, I'll use VARCHAR(100) to be safe, or match treeplant if I could see it.
        // I'll assume VARCHAR(100) is safe enough.
        await query(`
            CREATE TABLE IF NOT EXISTS user_tree_tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(100) NOT NULL,
                task_code VARCHAR(50) NOT NULL,
                last_completed_at DATETIME,
                is_completed BOOLEAN DEFAULT 0,
                INDEX idx_user_task (user_id, task_code)
            ) DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'user_tree_tasks' checked/created.");

        await query(`
            CREATE TABLE IF NOT EXISTS store_products (
                product_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                summary VARCHAR(255),
                description TEXT,
                type ENUM('virtual','physical') NOT NULL,
                price INT NOT NULL,
                stock INT NOT NULL DEFAULT 0,
                cover_url VARCHAR(500),
                media_urls TEXT,
                shipping_desc VARCHAR(255),
                status ENUM('on','off') DEFAULT 'on',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_type_status (type, status)
            ) DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'store_products' checked/created.");

        await query(`
            CREATE TABLE IF NOT EXISTS store_addresses (
                address_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                receiver_name VARCHAR(50) NOT NULL,
                receiver_phone VARCHAR(20) NOT NULL,
                province VARCHAR(50),
                city VARCHAR(50),
                district VARCHAR(50),
                detail VARCHAR(200) NOT NULL,
                is_default TINYINT DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_user_default (user_id, is_default)
            ) DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'store_addresses' checked/created.");

        await query(`
            CREATE TABLE IF NOT EXISTS store_orders (
                order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                order_no VARCHAR(40) UNIQUE,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                product_title VARCHAR(100) NOT NULL,
                product_cover VARCHAR(500),
                product_type ENUM('virtual','physical') NOT NULL,
                price INT NOT NULL,
                pay_log INT NOT NULL,
                pay_cropped_log INT NOT NULL,
                shipping_desc VARCHAR(255),
                status ENUM('pending','shipped','completed','canceled') DEFAULT 'pending',
                address_id INT,
                receiver_name VARCHAR(50),
                receiver_phone VARCHAR(20),
                receiver_province VARCHAR(50),
                receiver_city VARCHAR(50),
                receiver_district VARCHAR(50),
                receiver_detail VARCHAR(200),
                tracking_number VARCHAR(100),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                shipped_at DATETIME,
                completed_at DATETIME,
                INDEX idx_user_status (user_id, status)
            ) DEFAULT CHARSET=utf8mb4;
        `);
        console.log("Table 'store_orders' checked/created.");

        // 4. Insert default 'daily_signin' task
        // growth_reward: Let's say 10 points. 10 days to reach 100.
        try {
            await query(`
                INSERT INTO tree_tasks (task_code, task_name, task_desc, task_type, growth_reward)
                VALUES ('daily_signin', '每日签到', '每天签到获得成长值', 'daily', 10)
                ON DUPLICATE KEY UPDATE 
                task_name=VALUES(task_name), 
                task_desc=VALUES(task_desc),
                growth_reward=VALUES(growth_reward);
            `);
            console.log("Task 'daily_signin' inserted/updated.");
        } catch (e) {
            console.error("Error inserting task:", e);
        }

        console.log("Database initialization completed.");
        process.exit(0);
    } catch (e) {
        console.error("Fatal Error during DB init:", e);
        process.exit(1);
    }
}

initDB();

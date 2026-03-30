import pool from '@/app/lib/db';

export type VerificationCodePurpose = 'verify-account' | 'reset-password';

export type UserRow = {
    id: number;
    full_name: string | null;
    email: string;
    password: string;
    phone: string | null;
    role: 'admin' | 'customer';
    avatar: string | null;
    status: 'active' | 'blocked';
    created_at: Date;
};

export async function getUserInfo() {
    const [rows] = await pool.query(`
        SELECT 
            u.id, 
            u.full_name as name, 
            u.email, 
            u.phone, 
            u.created_at as createdAt, 
            COUNT(o.id) as orderCount 
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
    `);
    return rows;
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const users = rows as UserRow[];
    return users.length > 0 ? users[0] : null;
}

export async function createUser(full_name: string, email: string, passwordHash: string) {
    const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password, status) VALUES (?, ?, ?, ?)',
        [full_name, email, passwordHash, 'blocked']
    );
    return result;
}

export async function createSocialUser(params: {
    full_name: string;
    email: string;
    avatar?: string | null;
}) {
    const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password, avatar, status) VALUES (?, ?, ?, ?, ?)',
        [params.full_name, params.email, 'social-login', params.avatar ?? null, 'active']
    );
    return result;
}

export async function updateUserProfileById(params: {
    userId: number;
    full_name?: string | null;
    avatar?: string | null;
    status?: 'active' | 'blocked';
}) {
    const [result] = await pool.query(
        `UPDATE users
         SET full_name = COALESCE(?, full_name),
             avatar = COALESCE(?, avatar),
             status = COALESCE(?, status)
         WHERE id = ?`,
        [params.full_name ?? null, params.avatar ?? null, params.status ?? null, params.userId]
    );
    return result;
}

export async function updateUserStatusById(userId: number, status: 'active' | 'blocked') {
    const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
    return result;
}

export async function updateUserPasswordById(userId: number, passwordHash: string) {
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [passwordHash, userId]);
    return result;
}

async function ensureVerificationCodeTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_verification_codes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id INT UNSIGNED NOT NULL,
            purpose VARCHAR(30) NOT NULL DEFAULT 'verify-account',
            code VARCHAR(10) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY uniq_user_purpose (user_id, purpose),
            INDEX (code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [purposeColumn] = await pool.query("SHOW COLUMNS FROM user_verification_codes LIKE 'purpose'");
    if (Array.isArray(purposeColumn) && purposeColumn.length === 0) {
        await pool.query("ALTER TABLE user_verification_codes ADD COLUMN purpose VARCHAR(30) NOT NULL DEFAULT 'verify-account' AFTER user_id");
        await pool.query("UPDATE user_verification_codes SET purpose = 'verify-account' WHERE purpose IS NULL OR purpose = ''");
    }

    const [oldIndex] = await pool.query("SHOW INDEX FROM user_verification_codes WHERE Key_name = 'uniq_user_id'");
    if (Array.isArray(oldIndex) && oldIndex.length > 0) {
        await pool.query('ALTER TABLE user_verification_codes DROP INDEX uniq_user_id');
    }

    const [newIndex] = await pool.query("SHOW INDEX FROM user_verification_codes WHERE Key_name = 'uniq_user_purpose'");
    if (Array.isArray(newIndex) && newIndex.length === 0) {
        await pool.query('ALTER TABLE user_verification_codes ADD UNIQUE KEY uniq_user_purpose (user_id, purpose)');
    }
}

export async function createOrReplaceVerificationCode(
    userId: number,
    code: string,
    expiresAt: Date,
    purpose: VerificationCodePurpose = 'verify-account'
) {
    await ensureVerificationCodeTable();
    const [result] = await pool.query(
        `INSERT INTO user_verification_codes (user_id, purpose, code, expires_at)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE code = VALUES(code), expires_at = VALUES(expires_at), created_at = CURRENT_TIMESTAMP`,
        [userId, purpose, code, expiresAt]
    );
    return result;
}

export async function findValidVerificationCode(
    userId: number,
    code: string,
    purpose: VerificationCodePurpose = 'verify-account'
) {
    await ensureVerificationCodeTable();
    const [rows] = await pool.query(
        'SELECT * FROM user_verification_codes WHERE user_id = ? AND purpose = ? AND code = ? AND expires_at >= NOW() LIMIT 1',
        [userId, purpose, code]
    );
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function deleteVerificationCodeByUserId(
    userId: number,
    purpose?: VerificationCodePurpose
) {
    await ensureVerificationCodeTable();
    const [result] = purpose
        ? await pool.query('DELETE FROM user_verification_codes WHERE user_id = ? AND purpose = ?', [userId, purpose])
        : await pool.query('DELETE FROM user_verification_codes WHERE user_id = ?', [userId]);
    return result;
}
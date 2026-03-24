import pool from '@/app/lib/db';

export async function getUserInfo() {
    const UserInfo = await pool.query('SELECT * FROM users');
    return UserInfo;
}
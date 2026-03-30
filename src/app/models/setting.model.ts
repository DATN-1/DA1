import pool from "../lib/db";
import { SettingItem, SettingMap } from "../type/SettingType";
import { ResultSetHeader } from "mysql2";

export async function getAllSettings(): Promise<SettingItem[]> {
    const [rows] = await pool.query('SELECT * FROM settings');
    return rows as SettingItem[];
}

export async function getSettingByKey(key: string): Promise<SettingItem | null> {
    const [rows] = await pool.query('SELECT * FROM settings WHERE key_name = ? LIMIT 1', [key]);
    const settings = rows as SettingItem[];
    return settings.length > 0 ? settings[0] : null;
}

export async function upsertSetting(key_name: string, value: string) {
    // MySQL 8.0+ supports ON DUPLICATE KEY UPDATE but we need unique constraint on key_name.
    // If key_name isn't strictly UNIQUE in DB schema currently, we should check and update:
    const existing = await getSettingByKey(key_name);
    
    if (existing) {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE settings SET value = ? WHERE key_name = ?',
            [value, key_name]
        );
        return result;
    } else {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO settings (key_name, value) VALUES (?, ?)',
            [key_name, value]
        );
        return result;
    }
}

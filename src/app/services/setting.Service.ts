import { getAllSettings, upsertSetting } from '../models/setting.model';

export async function fetchAllSettingsService() {
    return await getAllSettings();
}

/**
 * Update multiple settings at once
 * @param settings Object with { key_name: value } mapping
 */
export async function updateAllSettingsService(settings: Record<string, string>) {
    const keys = Object.keys(settings);
    
    // Process them sequentially to avoid locking issues in small setups
    for (const key of keys) {
        if (settings[key] !== undefined && settings[key] !== null) {
            await upsertSetting(key, settings[key]);
        }
    }

    return true;
}

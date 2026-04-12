import { NextResponse } from 'next/server';
import { 
    fetchAllSettingsService, 
    updateAllSettingsService
} from '../services/setting.Service';

export async function fetchAllSettingsController() {
    try {
        const settings = await fetchAllSettingsService();
        
        // Convert array [{key_name: 'a', value: '1'}] to object { a: '1' }
        const settingsObj: Record<string, string> = {};
        settings.forEach(item => {
            if (item.value) settingsObj[item.key_name] = item.value;
        });

        return NextResponse.json(settingsObj);
    } catch (error: any) {
        console.error('[Setting Controller GET]', error);
        return NextResponse.json({ error: error.message || 'Lỗi tải Cài đặt' }, { status: 500 });
    }
}

export async function updateSettingsController(req: Request) {
    try {
        const data = await req.json(); // Expected payload: { site_name: "...", hotline: "..." }
        
        if (!data || typeof data !== 'object') {
            return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
        }

        await updateAllSettingsService(data);
        
        return NextResponse.json({ message: "Lưu cài đặt thành công" }, { status: 200 });
    } catch (error: any) {
        console.error('[Setting Controller PUT]', error);
        return NextResponse.json({ error: error.message || 'Lỗi lưu Cài đặt' }, { status: 400 });
    }
}

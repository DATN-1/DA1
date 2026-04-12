import { NextResponse } from 'next/server';
import { 
    fetchAllBannersService, 
    createBannerService, 
    updateBannerService, 
    deleteBannerService 
} from '../services/banner.Service';

export async function fetchAllBannersController() {
    try {
        const banners = await fetchAllBannersService();
        return NextResponse.json(banners);
    } catch (error: any) {
        console.error('[Banner Controller GET]', error);
        return NextResponse.json({ error: error.message || 'Lỗi lấy banner' }, { status: 500 });
    }
}

export async function createBannerController(req: Request) {
    try {
        const data = await req.json();
        await createBannerService(data);
        return NextResponse.json({ message: "Thêm banner thành công" }, { status: 201 });
    } catch (error: any) {
        console.error('[Banner Controller POST]', error);
        return NextResponse.json({ error: error.message || 'Lỗi thêm banner' }, { status: 400 });
    }
}

export async function updateBannerController(req: Request) {
    try {
        const data = await req.json();
        const { id, ...updateData } = data;
        
        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID banner' }, { status: 400 });
        }

        await updateBannerService(id, updateData);
        return NextResponse.json({ message: "Cập nhật banner thành công" }, { status: 200 });
    } catch (error: any) {
        console.error('[Banner Controller PUT]', error);
        return NextResponse.json({ error: error.message || 'Lỗi cập nhật banner' }, { status: 400 });
    }
}

export async function deleteBannerController(req: Request) {
    try {
        const data = await req.json();
        const { id } = data;

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID banner' }, { status: 400 });
        }

        await deleteBannerService(id);
        return NextResponse.json({ message: "Xóa banner thành công" }, { status: 200 });
    } catch (error: any) {
        console.error('[Banner Controller DELETE]', error);
        return NextResponse.json({ error: error.message || 'Lỗi xóa banner' }, { status: 400 });
    }
}

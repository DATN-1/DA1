import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../models/banner.model';
import { BannerForm } from '../type/BannerType';

export async function fetchAllBannersService() {
    return await getAllBanners();
}

export async function createBannerService(data: BannerForm) {
    if (!data.image_url) {
        throw new Error("URL hình ảnh không được để trống!");
    }
    
    // Default value adjustments if needed
    data.display_order = Number(data.display_order) || 0;

    const result = await createBanner(data);
    return result;
}

export async function updateBannerService(id: number, data: BannerForm) {
    if (!data.image_url) {
        throw new Error("URL hình ảnh không được để trống!");
    }

    data.display_order = Number(data.display_order) || 0;

    const result = await updateBanner(id, data);
    if (result.affectedRows === 0) {
        throw new Error("Không tìm thấy Banner để cập nhật");
    }

    return result;
}

export async function deleteBannerService(id: number) {
    if (!id) throw new Error("ID Banner không hợp lệ");
    
    const result = await deleteBanner(id);
    if (result.affectedRows === 0) {
        throw new Error("Không tìm thấy Banner để xóa");
    }
    return result;
}

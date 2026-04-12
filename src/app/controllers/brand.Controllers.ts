import { getAllBrandsService, createBrandService, updateBrandService, deleteBrandService } from '@/app/services/brand.Service';

export async function getAllBrandsController() {
  try {
    const brands = await getAllBrandsService();
    return Response.json(brands);
  } catch (error: any) {
    console.error('[getAllBrandsController]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể tải thương hiệu' }, { status: 500 });
  }
}

export async function createBrandController(req: Request) {
  try {
    const { name, logo_url } = await req.json();
    if (!name?.trim()) return Response.json({ success: false, error: 'Tên thương hiệu không được để trống' }, { status: 400 });
    const id = await createBrandService(name, logo_url ?? null);
    return Response.json({ success: true, id, message: 'Thêm thương hiệu thành công' });
  } catch (error: any) {
    console.error('[createBrandController]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể thêm thương hiệu' }, { status: 500 });
  }
}

export async function updateBrandController(req: Request) {
  try {
    const { id, name, logo_url } = await req.json();
    if (!id) return Response.json({ success: false, error: 'Thiếu ID thương hiệu' }, { status: 400 });
    if (!name?.trim()) return Response.json({ success: false, error: 'Tên thương hiệu không được để trống' }, { status: 400 });
    await updateBrandService(Number(id), name, logo_url ?? null);
    return Response.json({ success: true, message: 'Cập nhật thương hiệu thành công' });
  } catch (error: any) {
    console.error('[updateBrandController]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể cập nhật thương hiệu' }, { status: 500 });
  }
}

export async function deleteBrandController(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return Response.json({ success: false, error: 'Thiếu ID thương hiệu' }, { status: 400 });
    await deleteBrandService(Number(id));
    return Response.json({ success: true, message: 'Xóa thương hiệu thành công' });
  } catch (error: any) {
    console.error('[deleteBrandController]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể xóa thương hiệu' }, { status: 500 });
  }
}

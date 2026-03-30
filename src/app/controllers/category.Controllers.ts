import { getAllCategoriesService, createCategoryService, updateCategoryService, deleteCategoryService } from '@/app/services/category.Service';

export async function getAllCategoriesController() {
  try {
    const categories = await getAllCategoriesService();
    return Response.json(categories);
  } catch (error: any) {
    console.error('[getAllCategoriesController]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể tải danh mục' }, { status: 500 });
  }
}

export async function createCategoryController(req: Request) {
  try {
    const body = await req.json();
    const id = await createCategoryService(body);
    return Response.json({ success: true, id, message: 'Thêm danh mục thành công' });
  } catch (error: any) {
    console.error('[createCategoryController]', error?.message);
    const status = error?.message?.includes('không được') ? 400 : 500;
    return Response.json({ success: false, error: error?.message ?? 'Không thể thêm danh mục' }, { status });
  }
}

export async function updateCategoryController(req: Request) {
  try {
    const { id, ...data } = await req.json();
    if (!id) return Response.json({ success: false, error: 'Thiếu ID danh mục' }, { status: 400 });
    await updateCategoryService(Number(id), data);
    return Response.json({ success: true, message: 'Cập nhật danh mục thành công' });
  } catch (error: any) {
    console.error('[updateCategoryController]', error?.message);
    const status = error?.message?.includes('không') ? 400 : 500;
    return Response.json({ success: false, error: error?.message ?? 'Không thể cập nhật danh mục' }, { status });
  }
}

export async function deleteCategoryController(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return Response.json({ success: false, error: 'Thiếu ID danh mục' }, { status: 400 });
    await deleteCategoryService(Number(id));
    return Response.json({ success: true, message: 'Xóa danh mục thành công' });
  } catch (error: any) {
    console.error('[deleteCategoryController]', error?.message);
    const status = error?.message?.includes('không') ? 400 : 500;
    return Response.json({ success: false, error: error?.message ?? 'Không thể xóa danh mục' }, { status });
  }
}

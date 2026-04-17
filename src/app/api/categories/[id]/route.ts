import { getCategoryById } from '@/app/models/categories.model';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!id || isNaN(id)) {
      return Response.json({ success: false, error: 'ID không hợp lệ' }, { status: 400 });
    }
    const category = await getCategoryById(id);
    if (!category) {
      return Response.json({ success: false, error: 'Danh mục không tồn tại' }, { status: 404 });
    }
    return Response.json(category);
  } catch (error: any) {
    console.error('[GET /api/categories/[id]]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể tải danh mục' }, { status: 500 });
  }
}

import { getBrandById } from '@/app/models/brand.model';

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
    const brand = await getBrandById(id);
    if (!brand) {
      return Response.json({ success: false, error: 'Thương hiệu không tồn tại' }, { status: 404 });
    }
    return Response.json(brand);
  } catch (error: any) {
    console.error('[GET /api/brands/[id]]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể tải thương hiệu' }, { status: 500 });
  }
}

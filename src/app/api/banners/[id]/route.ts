import { getBannerById } from '@/app/models/banner.model';

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
    const banner = await getBannerById(id);
    if (!banner) {
      return Response.json({ success: false, error: 'Banner không tồn tại' }, { status: 404 });
    }
    return Response.json(banner);
  } catch (error: any) {
    console.error('[GET /api/banners/[id]]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể tải banner' }, { status: 500 });
  }
}

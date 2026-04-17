import { getBlogById } from '@/app/models/blog.model';

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
    const blog = await getBlogById(id);
    if (!blog) {
      return Response.json({ success: false, error: 'Bài viết không tồn tại' }, { status: 404 });
    }
    return Response.json(blog);
  } catch (error: any) {
    console.error('[GET /api/blogs/[id]]', error?.message);
    return Response.json({ success: false, error: error?.message ?? 'Không thể tải bài viết' }, { status: 500 });
  }
}

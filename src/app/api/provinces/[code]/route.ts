import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  try {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`, {
      next: { revalidate: 86400 }, // cache 24h
    });
    if (!res.ok) throw new Error('Upstream error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Không thể tải danh sách quận/huyện' }, { status: 502 });
  }
}

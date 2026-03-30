import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://provinces.open-api.vn/api/p/', {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error('Upstream error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Kh\u00f4ng th\u1ec3 t\u1ea3i danh s\u00e1ch t\u1ec9nh/th\u00e0nh ph\u1ed1' }, { status: 502 });
  }
}

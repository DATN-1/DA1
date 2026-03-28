import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id, name
       FROM brands
       ORDER BY name ASC`
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Không thể tải thương hiệu' }, { status: 500 });
  }
}

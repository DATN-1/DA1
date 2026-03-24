import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';


export async function GET() {
    const UserInfo = await pool.query('SELECT * FROM users');
    return NextResponse.json(UserInfo);
}



import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { fetchUserInfoController } from '@/app/controllers/User.Controllers';

export async function GET() {
    return fetchUserInfoController();
}


import { NextResponse } from 'next/server';
import { getCouponById, updateCoupon, deleteCoupon } from '@/app/models/coupon.model';

export async function GET(request: Request, context: any) {
    // Await params if it is a Promise in Next.js 15+
    const params = await context.params;
    const { id } = params;
    try {
        const coupon = await getCouponById(Number(id));
        if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: any) {
    const params = await context.params;
    const { id } = params;
    try {
        const body = await request.json();
        
        let updateData: any = { ...body };
        if (body.start_date) updateData.start_date = new Date(body.start_date);
        if (body.end_date) updateData.end_date = new Date(body.end_date);
        
        await updateCoupon(Number(id), updateData);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: any) {
    const params = await context.params;
    const { id } = params;
    try {
        await deleteCoupon(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}

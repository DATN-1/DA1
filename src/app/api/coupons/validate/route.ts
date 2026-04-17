import { NextResponse } from 'next/server';
import { getAllCoupons } from '@/app/models/coupon.model';

export async function POST(request: Request) {
    try {
        const { code, orderAmount } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Vui lòng nhập mã giảm giá' }, { status: 400 });
        }

        const coupons = await getAllCoupons();
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());

        if (!coupon) {
            return NextResponse.json({ error: 'Mã giảm giá không tồn tại' }, { status: 404 });
        }

        if (coupon.status !== 'active') {
            return NextResponse.json({ error: 'Mã giảm giá đã hết hạn' }, { status: 400 });
        }

        const now = new Date();
        const startDate = new Date(coupon.start_date);
        const endDate = new Date(coupon.end_date);

        if (now < startDate) {
            return NextResponse.json({ error: 'Mã giảm giá chưa có hiệu lực' }, { status: 400 });
        }

        if (now > endDate) {
            return NextResponse.json({ error: 'Mã giảm giá đã hết hạn' }, { status: 400 });
        }

        if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
            return NextResponse.json({ error: 'Mã giảm giá đã đạt giới hạn sử dụng' }, { status: 400 });
        }

        if (coupon.min_order_value !== null && orderAmount < coupon.min_order_value) {
            return NextResponse.json({
                error: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN').format(coupon.min_order_value)}đ để dùng mã này`
            }, { status: 400 });
        }

        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round((orderAmount * coupon.discount_value) / 100);
        } else {
            discountAmount = Math.min(coupon.discount_value, orderAmount);
        }

        return NextResponse.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value,
            },
            discountAmount,
            finalAmount: orderAmount - discountAmount,
        });
    } catch (error) {
        console.error('Coupon validate error:', error);
        return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
    }
}

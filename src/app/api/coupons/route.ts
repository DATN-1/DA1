import { NextResponse } from 'next/server';
import { getAllCoupons, createCoupon } from '@/app/models/coupon.model';
import pool from '@/app/lib/db';

export async function GET() {
    try {
        const coupons = await getAllCoupons();
        return NextResponse.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.code || !body.discount_type || body.discount_value === undefined) {
            return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
        }

        const now = new Date();
        const twoMonthsLater = new Date();
        twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

        const result = await createCoupon({
            code: body.code,
            description: body.description || null,
            discount_type: body.discount_type,
            discount_value: body.discount_value,
            start_date: body.start_date ? new Date(body.start_date) : now,
            end_date: body.end_date ? new Date(body.end_date) : twoMonthsLater,
            usage_limit: body.usage_limit || null,
            min_order_value: body.min_order_value || null,
            status: body.status || 'active',
        });

        return NextResponse.json({ id: result.insertId, ...body }, { status: 201 });
    } catch (error) {
        console.error('Error creating coupon:', error);
        return NextResponse.json({ error: 'Không thể tạo mã giảm giá' }, { status: 500 });
    }
}

// Seed sample coupons
export async function PUT() {
    try {
        const now = new Date();
        const twoMonthsLater = new Date();
        twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

        const sampleCoupons = [
            { code: 'WELCOME10', description: 'Giảm 10% cho khách mới', discount_type: 'percentage', discount_value: 10, min_order_value: 200000, usage_limit: 100 },
            { code: 'SALE20', description: 'Giảm 20% đơn từ 500k', discount_type: 'percentage', discount_value: 20, min_order_value: 500000, usage_limit: 50 },
            { code: 'GIAM50K', description: 'Giảm 50.000đ đơn từ 300k', discount_type: 'fixed_amount', discount_value: 50000, min_order_value: 300000, usage_limit: 200 },
            { code: 'FREESHIP', description: 'Giảm 30.000đ phí ship', discount_type: 'fixed_amount', discount_value: 30000, min_order_value: 0, usage_limit: 500 },
            { code: 'VIP30', description: 'Giảm 30% dành cho VIP', discount_type: 'percentage', discount_value: 30, min_order_value: 1000000, usage_limit: 20 },
            { code: 'AROMI15', description: 'Giảm 15% cho đơn bất kỳ', discount_type: 'percentage', discount_value: 15, min_order_value: 0, usage_limit: null },
            { code: 'GIAM100K', description: 'Giảm 100.000đ đơn từ 800k', discount_type: 'fixed_amount', discount_value: 100000, min_order_value: 800000, usage_limit: 30 },
        ];

        let inserted = 0;
        for (const c of sampleCoupons) {
            try {
                await pool.query(
                    `INSERT IGNORE INTO coupons (code, description, discount_type, discount_value, start_date, end_date, usage_limit, min_order_value, status, usage_count)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)`,
                    [c.code, c.description, c.discount_type, c.discount_value, now, twoMonthsLater, c.usage_limit, c.min_order_value]
                );
                inserted++;
            } catch (_e) {}
        }

        // Also fix any existing coupons with expired dates
        await pool.query(
            `UPDATE coupons SET start_date = ?, end_date = ?, status = 'active' WHERE end_date < NOW() OR start_date > NOW()`,
            [now, twoMonthsLater]
        );

        return NextResponse.json({ message: `Đã thêm ${inserted} mã mới và cập nhật ngày hết hạn cho mã cũ` });
    } catch (error) {
        console.error('Seed coupons error:', error);
        return NextResponse.json({ error: 'Lỗi khi seed coupon' }, { status: 500 });
    }
}

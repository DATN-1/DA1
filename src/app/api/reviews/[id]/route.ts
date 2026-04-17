import { NextResponse } from 'next/server';
import { updateReviewStatus, deleteReview } from '@/app/models/review.model';

export async function PUT(request: Request, context: any) {
    const params = await context.params;
    const { id } = params;
    try {
        const body = await request.json();
        await updateReviewStatus(Number(id), body.status);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: any) {
    const params = await context.params;
    const { id } = params;
    try {
        await deleteReview(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}

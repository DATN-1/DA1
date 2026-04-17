import { NextResponse } from 'next/server';
import { getBlogCategoryById, updateBlogCategory, deleteBlogCategory } from '@/app/models/blog_category.model';

export async function GET(request: Request, context: any) {
    const params = await context.params;
    const { id } = params;
    try {
        const category = await getBlogCategoryById(Number(id));
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: any) {
    const params = await context.params;
    const { id } = params;
    try {
        const body = await request.json();
        await updateBlogCategory(Number(id), body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: any) {
    const params = await context.params;
    const { id } = params;
    try {
        await deleteBlogCategory(Number(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

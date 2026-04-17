import { NextResponse } from 'next/server';
import { getAllBlogCategories, createBlogCategory } from '@/app/models/blog_category.model';

export async function GET() {
    try {
        const categories = await getAllBlogCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.name || !body.slug) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await createBlogCategory({
            name: body.name,
            slug: body.slug,
            description: body.description || null,
            status: body.status || 'active',
        });

        return NextResponse.json({ id: result.insertId, ...body }, { status: 201 });
    } catch (error) {
        console.error('Error creating blog category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

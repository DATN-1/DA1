import { NextResponse } from 'next/server';
import { 
    fetchAllBlogsService, 
    createBlogService, 
    updateBlogService, 
    deleteBlogService 
} from '../services/blog.Service';

export async function fetchAllBlogsController() {
    try {
        const blogs = await fetchAllBlogsService();
        return NextResponse.json(blogs);
    } catch (error: any) {
        console.error('[Blog Controller GET]', error);
        return NextResponse.json({ error: error.message || 'Lỗi lấy bài viết' }, { status: 500 });
    }
}

export async function createBlogController(req: Request) {
    try {
        const data = await req.json();
        await createBlogService(data);
        return NextResponse.json({ message: "Thêm bài viết thành công" }, { status: 201 });
    } catch (error: any) {
        console.error('[Blog Controller POST]', error);
        return NextResponse.json({ error: error.message || 'Lỗi thêm bài viết' }, { status: 400 });
    }
}

export async function updateBlogController(req: Request) {
    try {
        const data = await req.json();
        const { id, ...updateData } = data;
        
        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID bài viết' }, { status: 400 });
        }

        await updateBlogService(id, updateData);
        return NextResponse.json({ message: "Cập nhật bài viết thành công" }, { status: 200 });
    } catch (error: any) {
        console.error('[Blog Controller PUT]', error);
        return NextResponse.json({ error: error.message || 'Lỗi cập nhật bài viết' }, { status: 400 });
    }
}

export async function deleteBlogController(req: Request) {
    try {
        const data = await req.json();
        const { id } = data;

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID bài viết' }, { status: 400 });
        }

        await deleteBlogService(id);
        return NextResponse.json({ message: "Xóa bài viết thành công" }, { status: 200 });
    } catch (error: any) {
        console.error('[Blog Controller DELETE]', error);
        return NextResponse.json({ error: error.message || 'Lỗi xóa bài viết' }, { status: 400 });
    }
}

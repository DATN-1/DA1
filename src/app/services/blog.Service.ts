import { getAllBlogs, createBlog, updateBlog, deleteBlog, getBlogBySlug } from '../models/blog.model';
import { Blog } from '../type/BlogType';

export async function fetchAllBlogsService() {
    return await getAllBlogs();
}

export async function createBlogService(data: Omit<Blog, 'id' | 'created_at'>) {
    if (!data.title || !data.slug || !data.category || !data.content) {
        throw new Error("Tiêu đề, đường dẫn, chuyên mục, và nội dung không được để trống!");
    }

    const existing = await getBlogBySlug(data.slug);
    if (existing) {
        throw new Error("Đường dẫn (slug) đã tồn tại, vui lòng chọn tên khác!");
    }

    const result = await createBlog(data);
    return result;
}

export async function updateBlogService(id: number, data: Omit<Blog, 'id' | 'created_at'>) {
    if (!data.title || !data.slug || !data.category || !data.content) {
        throw new Error("Tiêu đề, đường dẫn, chuyên mục, và nội dung không được để trống!");
    }

    const existing = await getBlogBySlug(data.slug);
    if (existing && existing.id !== id) {
        throw new Error("Đường dẫn (slug) đã tồn tại cho bài viết khác!");
    }

    const result = await updateBlog(id, data);
    if (result.affectedRows === 0) {
        throw new Error("Không tìm thấy bài viết để cập nhật");
    }

    return result;
}

export async function deleteBlogService(id: number) {
    if (!id) throw new Error("ID bài viết không hợp lệ");
    
    const result = await deleteBlog(id);
    if (result.affectedRows === 0) {
        throw new Error("Không tìm thấy bài viết để xóa");
    }
    return result;
}

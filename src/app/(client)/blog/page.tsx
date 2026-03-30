import '@/style/index.css';
import Breadcrumb from "@/app/(client)/components/Breadcrumb";
import { getAllBlogs } from '@/app/models/blog.model';
import Link from 'next/link';

export default async function BlogPage() {
  const blogs = await getAllBlogs();
  
  // Lọc chỉ lấy bài đăng đã xuất bản
  const publishedBlogs = blogs.filter(b => b.status === 'published');

  return (
    <div>
      <div className="container">
        <Breadcrumb items={[
          { label: "Trang Chủ", href: "/" },
          { label: "Góc Chia Sẻ" }
        ]} />
      </div>
      <section className="gradient-bg" style={{ padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "1.5rem" }} className="text-gradient">
            Góc Chia Sẻ
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#6b7280", maxWidth: "700px", margin: "0 auto" }}>
            Khám phá thế giới nến thơm, những mẹo trang trí và bí quyết tạo nên không gian sống lý tưởng
          </p>
        </div>
      </section>

      {/* Blog List Section */}
      <section style={{ padding: "5rem 0", background: "white" }}>
        <div className="container">
          <div className="blog-grid">
            {publishedBlogs.length === 0 ? (
                <p style={{ textAlign: 'center', width: '100%', color: '#6b7280' }}>Chưa có bài viết nào.</p>
            ) : (
                publishedBlogs.map((blog) => (
                  <article className="blog-card" key={blog.id}>
                    <div className="blog-image">
                      <img src={blog.image_url || 'https://via.placeholder.com/400x300'} alt={blog.title} />
                      <div className="blog-category">{blog.category}</div>
                    </div>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span>📅 {new Date(blog.created_at || new Date()).toLocaleDateString('vi-VN')}</span>
                        <span>👤 Bởi {blog.author}</span>
                      </div>
                      <h3 style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.4em'
                      }}>
                          {blog.title}
                      </h3>
                      <p style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                      }}>
                          {blog.summary}
                      </p>
                      <Link href={`/blog/${blog.slug}`} className="blog-link">
                          Đọc Thêm →
                      </Link>
                    </div>
                  </article>
                ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
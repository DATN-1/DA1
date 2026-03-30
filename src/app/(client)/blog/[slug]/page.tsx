import '@/style/index.css';
import { getBlogBySlug, getAllBlogs } from '@/app/models/blog.model';
import Breadcrumb from "@/app/(client)/components/Breadcrumb";
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: 'Không tìm thấy bài viết' };
  return {
    title: `${blog.title} | Aromi Candle`,
    description: blog.summary,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.status !== 'published') {
    notFound();
  }

  // Lấy vài bài viết liên quan (cùng danh mục hoặc mới nhất, tạm thời lấy 3 bài mới nhất)
  const allBlogs = await getAllBlogs();
  const relatedBlogs = allBlogs
    .filter(b => b.status === 'published' && b.id !== blog.id)
    .slice(0, 3);

  return (
    <>
      <div className="container" style={{ margin: '2rem auto' }}>
        <Breadcrumb items={[
          { label: "Trang Chủ", href: "/" },
          { label: "Góc Chia Sẻ", href: "/blog" },
          { label: blog.title }
        ]} />
      </div>

      <article className="container" style={{ maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#d97706', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
            {blog.category}
          </div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.3, marginBottom: '1.5rem', color: '#111827' }}>
            {blog.title}
          </h1>
          <div style={{ color: '#6b7280', fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <span>📅 {new Date(blog.created_at || new Date()).toLocaleDateString('vi-VN')}</span>
            <span>•</span>
            <span>👤 Bởi {blog.author}</span>
          </div>
        </div>

        {blog.image_url && (
          <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '3rem' }}>
            <img 
              src={blog.image_url} 
              alt={blog.title} 
              style={{ width: '100%', height: 'auto', objectFit: 'cover', maxHeight: '500px' }} 
            />
          </div>
        )}

        {/* Nội dung bài viết */}
        <div 
          className="blog-detail-content"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
          style={{ lineHeight: 1.8, fontSize: '1.125rem', color: '#374151' }}
        />
      </article>

      {/* Bài viết liên quan */}
      {relatedBlogs.length > 0 && (
        <section style={{ background: '#f9fafb', padding: '4rem 0' }}>
          <div className="container">
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', fontWeight: 700 }}>Có Thể Bạn Sẽ Thích</h2>
            <div className="blog-grid" style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' 
            }}>
              {relatedBlogs.map(related => (
                <article className="blog-card" key={related.id} style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <div className="blog-image" style={{ height: '200px', overflow: 'hidden' }}>
                      <img src={related.image_url || 'https://via.placeholder.com/400x300'} alt={related.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="blog-content" style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: 1.4, height: '3.5rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Link href={`/blog/${related.slug}`} style={{ color: '#111827', textDecoration: 'none' }}>
                            {related.title}
                        </Link>
                      </h3>
                      <Link href={`/blog/${related.slug}`} style={{ color: '#d97706', fontWeight: 600, textDecoration: 'none' }}>
                          Đọc tiếp →
                      </Link>
                    </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

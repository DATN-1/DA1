'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type GalleryItem = {
  id: number;
  product_id: number | null;
  product_name?: string | null;
  image_url: string;
  title: string | null;
  category: string;
};

export default function GalleryShowcase() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/galleries?status=active');
        const data = await res.json();
        if (!res.ok) {
          setItems([]);
          return;
        }

        const list = Array.isArray(data) ? data.slice(0, 6) : [];
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '2rem', color: '#1f2937' }}>Gallery San Pham</h2>
            <p style={{ margin: '0.4rem 0 0', color: '#64748b' }}>Anh that tu san pham trong he thong.</p>
          </div>
          <Link href="/gallery" style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'none' }}>
            Xem tat ca
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {items.map((item) => (
            <article key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden', background: '#fff' }}>
              <img
                src={item.image_url}
                alt={item.title || 'Gallery image'}
                style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }}
                onError={(event) => {
                  event.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image';
                }}
              />
              <div style={{ padding: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: 6 }}>{item.title || 'Khong co tieu de'}</div>
                <div style={{ fontSize: 12, color: '#f97316', marginBottom: 8 }}>{item.category}</div>
                {item.product_id ? (
                  <Link href={`/products/${item.product_id}`} style={{ fontSize: 13, color: '#0f766e', fontWeight: 700, textDecoration: 'none' }}>
                    Xem san pham: {item.product_name || `#${item.product_id}`}
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

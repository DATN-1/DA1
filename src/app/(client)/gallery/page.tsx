'use client';

import { useEffect, useMemo, useState } from 'react';
import Breadcrumb from '@/app/(client)/components/Breadcrumb';
import { Gallery } from '@/app/type/GalleryType';
import styles from './gallery.module.css';
import Link from 'next/link';

export default function GalleryPage() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadGalleries = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('/api/galleries?status=active');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Khong the tai gallery');
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err?.message || 'Loi ket noi du lieu gallery');
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) {
        set.add(item.category);
      }
    });

    return ['all', ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'all') {
      return items;
    }

    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <main>
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Trang Chu', href: '/' },
            { label: 'Gallery' },
          ]}
        />
      </div>

      <section className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <h1>Gallery Anh</h1>
            <p>Du lieu duoc lay dong tu database, co the quan ly trong Admin.</p>
          </div>

          <div className={styles.filters}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles.filterBtn} ${selectedCategory === category ? styles.filterBtnActive : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Tat ca' : category}
              </button>
            ))}
          </div>

          {loading ? <p className={styles.feedback}>Dang tai gallery...</p> : null}
          {error ? <p className={`${styles.feedback} ${styles.feedbackError}`}>{error}</p> : null}

          {!loading && !error ? (
            filtered.length === 0 ? (
              <p className={styles.feedback}>Chua co anh nao trong gallery.</p>
            ) : (
              <div className={styles.grid}>
                {filtered.map((item) => (
                  <article className={styles.card} key={item.id}>
                    <img
                      src={item.image_url}
                      alt={item.title || 'Gallery image'}
                      onError={(event) => {
                        event.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image';
                      }}
                    />
                    <div className={styles.cardContent}>
                      <h3>{item.title || 'Khong co tieu de'}</h3>
                      <span>{item.category}</span>
                      {item.product_id ? (
                        <Link href={`/products/${item.product_id}`} className={styles.productLink}>
                          Xem san pham: {item.product_name || `#${item.product_id}`}
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )
          ) : null}
        </div>
      </section>
    </main>
  );
}

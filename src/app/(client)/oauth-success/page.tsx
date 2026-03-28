'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Dang xu ly dang nhap...');

  useEffect(() => {
    const syncSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (!response.ok || !data?.user?.email) {
          setMessage('Khong the lay thong tin dang nhap social.');
          return;
        }

        const mappedUser = {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name || data.user.name || null,
          role: data.user.role || 'customer',
        };

        window.localStorage.setItem('currentUser', JSON.stringify(mappedUser));
        window.sessionStorage.setItem('authMessage', 'Dang nhap social thanh cong');
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: mappedUser } }));

        setMessage('Dang nhap thanh cong. Dang chuyen huong...');
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 500);
      } catch {
        setMessage('Loi he thong khi dong bo dang nhap social.');
      }
    };

    syncSession();
  }, [router]);

  return (
    <div className="container" style={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>
      <p>{message}</p>
    </div>
  );
}

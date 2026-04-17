'use client';
import { useRef } from 'react';

export default function PartnerCarousel({ brands }: { brands: any[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 200; // Amount to scroll
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    if (!brands || brands.length === 0) {
        return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang cập nhật đối tác...</p>;
    }

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
            {/* Left Button */}
            <button
                onClick={() => scroll('left')}
                style={{
                    position: 'absolute',
                    left: 0,
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transform: 'translateX(-50%)'
                }}
            >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '2rem',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    padding: '1rem', // Give shadow some space
                    // Hide scrollbar
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div className="no-scrollbar" style={{ display: 'flex', gap: '2rem' }}>
                    {brands.map(brand => (
                        <div key={brand.id} className="partner-logo" style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: 8,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 140,
                            height: 80,
                            flexShrink: 0
                        }}>
                            {brand.logo_url ? (
                                <img src={brand.logo_url} alt={brand.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontWeight: 'bold', color: '#6b7280', fontSize: 14 }}>{brand.name}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Button */}
            <button
                onClick={() => scroll('right')}
                style={{
                    position: 'absolute',
                    right: 0,
                    zIndex: 10,
                    width: 40,
                    height: 40,
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transform: 'translateX(50%)'
                }}
            >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
}

// Helper: render sao dựa vào rating thực tế
// Nếu chưa có đánh giá (rating = 0 hoặc null), hiển thị 5 sao xám
// Nếu có đánh giá, hiển thị số sao vàng chính xác

export function renderStars(rating: number | null | undefined) {
    const hasRating = rating != null && Number(rating) > 0;
    const filled = hasRating ? Math.round(Number(rating)) : 0;
    const stars = Array.from({ length: 5 }, (_, i) => i < filled);

    return (
        <div className="rating" style={{ display: 'flex', gap: 1 }}>
            {stars.map((active, i) => (
                <svg
                    key={i}
                    className={active ? 'star' : 'star'}
                    viewBox="0 0 20 20"
                    style={{ fill: active ? '#f59e0b' : '#d1d5db', width: 16, height: 16 }}
                >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
            ))}
            {!hasRating && (
                <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4, whiteSpace: 'nowrap' }}>0.0</span>
            )}
            {hasRating && (
                <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 4 }}>{Number(rating).toFixed(1)}</span>
            )}
        </div>
    );
}

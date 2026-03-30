import { NextResponse } from "next/server";
import { createProductReview, findProductById } from "@/app/models/product.model";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "ID sản phẩm không hợp lệ." }, { status: 400 });
    }

    const body = await request.json();
    const userId = Number(body?.userId);
    const rating = Number(body?.rating);
    const comment = String(body?.comment || "").trim();

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Bạn cần đăng nhập để đánh giá." }, { status: 401 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Số sao đánh giá phải từ 1 đến 5." }, { status: 400 });
    }

    if (comment.length < 8) {
      return NextResponse.json({ error: "Vui lòng nhập nội dung đánh giá tối thiểu 8 ký tự." }, { status: 400 });
    }

    const product = await findProductById(String(productId));
    if (!product) {
      return NextResponse.json({ error: "Sản phẩm không tồn tại." }, { status: 404 });
    }

    const review = await createProductReview({
      userId,
      productId,
      rating,
      comment,
    });

    if (!review) {
      return NextResponse.json({ error: "Không thể tạo đánh giá." }, { status: 500 });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Lỗi API POST /api/products/[id]/reviews:", error);
    return NextResponse.json(
      { error: error?.message || "Lỗi hệ thống khi gửi đánh giá." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  fetchProductControllerByID,
  updateProductController,
  deleteProductController,
} from "@/app/controllers/Product.Controllers";
import { assertAdminSession } from '@/app/api/_utils/adminAuth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await fetchProductControllerByID(id);

    return NextResponse.json(product);

  } catch (error: any) {
    console.error("Lỗi API /api/products/[id]:", error);

    const message = error?.message || "Lỗi không xác định";

    if(message === "Product not found") {
      return NextResponse.json(
        { error: message }, 
        { status: 404 }
      );
    }
    if(message === "ID không hợp lệ") {
      return NextResponse.json(
        { error: message }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await assertAdminSession();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { id } = await params;
    const productId = Number(id);
    const body = await request.json();

    const affectedRows = await updateProductController(productId, {
      name: String(body?.name || "").trim(),
      price: Number(body?.price || 0),
      stock: Number(body?.stock || 0),
      image_url: String(body?.image_url || "").trim(),
      category_id: body?.category_id ? Number(body.category_id) : null,
      brand_id: body?.brand_id ? Number(body.brand_id) : null,
      description: body?.description ? String(body.description).trim() : null,
      status: ["active", "draft", "archived"].includes(body?.status)
        ? body.status
        : "active",
    });

    if (!affectedRows) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cập nhật sản phẩm thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không thể cập nhật sản phẩm" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await assertAdminSession();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { id } = await params;
    const productId = Number(id);
    const affectedRows = await deleteProductController(productId);

    if (!affectedRows) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json({ message: "Xóa sản phẩm thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không thể xóa sản phẩm" }, { status: 400 });
  }
}
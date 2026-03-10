import { NextResponse } from "next/server";
import { fetchProductControllerByID } from "@/app/controllers/Product.Controllers";

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
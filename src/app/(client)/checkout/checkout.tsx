'use client';

import React from "react";
import Link from "next/link";
import "@/style/pay.css";

interface PaymentProps {
  orderCode: string;
  amount: number;
}

export default function CheckoutPayment({ orderCode, amount }: PaymentProps) {
  const qrUrl = `https://api.vietqr.io/image/970436-1024921490-CPvW05t.jpg?amount=${amount}&addInfo=${orderCode}&accountName=NGUYEN%20VAN%20HUNG`;

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "80vh", padding: "4rem 1rem" }}>
        <div className="container" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "white", padding: "3rem", borderRadius: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <h2 style={{ fontSize: "2rem", color: "#111827", marginBottom: "1.5rem", fontWeight: "bold" }}>Thanh Toán Đơn Hàng</h2>
            
            <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "#f3f4f6", borderRadius: "0.75rem", border: "1px dashed #d1d5db", textAlign: "left" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Thông tin thanh toán</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span>Mã đơn hàng:</span>
                <strong style={{ color: "#111827" }}>{orderCode}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span>Phương thức:</span>
                <strong>Chuyển khoản VietQR</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Số tiền cần chuyển:</span>
                <strong style={{ color: "#ef4444", fontSize: "1.2rem" }}>{new Intl.NumberFormat("vi-VN").format(amount)}đ</strong>
            </div>
            </div>

            <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#111827" }}>Mở ứng dụng ngân hàng để quét mã QR</h3>
            <div style={{ background: "#ffffff", padding: "1rem", display: "inline-block", borderRadius: "16px", border: "2px solid #e5e7eb" }}>
                <img src={qrUrl} alt="VietQR" style={{ width: "240px", height: "240px", display: "block", margin: "0 auto" }} />
            </div>
            <p style={{ color: "#d97706", fontSize: "0.95rem", marginTop: "1rem", backgroundColor: "#fef3c7", padding: "0.75rem", borderRadius: "0.5rem" }}> Nội dung chuyển tiền đã chứa mã đơn hàng (ghi chú: <strong>{orderCode}</strong>). Khoản thanh toán sẽ được tự động ghi nhận.</p>
            </div>

            <Link href="/" className="btn btn-gradient btn-full" style={{ padding: "1.25rem", fontSize: "1.1rem" }}>
            Xác Nhận Đã Chuyển Khoản / Về Trang Chủ
            </Link>
        </div>
        </div>
    </div>
  );
}
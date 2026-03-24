'use client';
import { useState, useEffect } from 'react';
import { ProductType } from '@/app/type/productType';


export default function Products() {
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        // Fetch products from API
        fetch('/api/products?limit=all')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const handleDelete = (id: number) => {
        setProducts(products.filter(product => product.id !== id));
    };

    return (
        <div className="content-padding">
            <div className="data-card">
                <div className="card-header">
                    <h2>Danh sách sản phẩm</h2>
                    <a href="#" className="btn-add">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        Thêm sản phẩm mới
                    </a>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Thương hiệu</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Kho hàng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                        <tr key={product.id}>
                            <td className="product-cell">
                                <img src={product.image} className="product-img" />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.brand_name}</td>
                            <td>{product.category_name}</td>
                            <td>{product.price}</td>
                            <td>{product.stock}</td>
                            <td><span className="badge badge-success">Còn hàng</span></td>
                            <td className="action-btns">
                                <button className="btn-icon btn-edit"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button className="btn-icon btn-delete" onClick={() => console.log('Delete Lavender Bliss')}><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </td>
                        </tr>
                        ))}
                        {/* <tr>
                            <td className="product-cell">
                                <img src="../images/ocean.jpg" className="product-img" />
                            </td>
                            <td>Ocean Breeze</td>
                            <td>Tươi mát</td>
                            <td>320.000đ</td>
                            <td>12</td>
                            <td><span className="badge badge-warning">Sắp hết</span></td>
                            <td className="action-btns">
                                <button className="btn-icon btn-edit"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button className="btn-icon btn-delete"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="product-cell">
                                <img src="../images/vanilla.jpg" className="product-img" />
                            </td>
                            <td>Vanilla Dream</td>
                            <td>Ngọt ngào</td>
                            <td>280.000đ</td>
                            <td>60</td>
                            <td><span className="badge badge-success">Còn hàng</span></td>
                            <td className="action-btns">
                                <button className="btn-icon btn-edit"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button className="btn-icon btn-delete"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="product-cell">
                                <img src="../images/rose.jpg" className="product-img" />
                            </td>
                            <td>Rose Garden</td>
                            <td>Quyến rũ</td>
                            <td>380.000đ</td>
                            <td>0</td>
                            <td><span className="badge badge-danger">Hết hàng</span></td>
                            <td className="action-btns">
                                <button className="btn-icon btn-edit"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button className="btn-icon btn-delete"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="product-cell">
                                <img src="../images/jasmine.jpg" className="product-img" />
                            </td>
                            <td>Jasmine Night</td>
                            <td>Tinh khiết</td>
                            <td>310.000đ</td>
                            <td>25</td>
                            <td><span className="badge badge-success">Còn hàng</span></td>
                            <td className="action-btns">
                                <button className="btn-icon btn-edit"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button className="btn-icon btn-delete"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </td>
                        </tr>
                        <tr>
                            <td className="product-cell">
                                <img src="../images/cinnamon.jpg" className="product-img" />
                            </td>
                            <td>Warm Cinnamon</td>
                            <td>Ấm áp</td>
                            <td>290.000đ</td>
                            <td>38</td>
                            <td><span className="badge badge-success">Còn hàng</span></td>
                            <td className="action-btns">
                                <button className="btn-icon btn-edit"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                                <button className="btn-icon btn-delete"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default function User() {
    return (
        <div className="content-padding">
            <div className="data-card">
                <div className="card-header"><h2>Danh sách khách hàng</h2></div>
                <table>
                    <thead>
                        <tr>
                            <th>Họ Tên</th>
                            <th>Email</th>
                            <th>Số Điện Thoại</th>
                            <th>Ngày Tham Gia</th>
                            <th>Đơn Hàng</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nguyễn Văn A</td>
                            <td>vana@gmail.com</td>
                            <td>0901234567</td>
                            <td>01/01/2026</td>
                            <td>5</td>
                            <td className="action-btns">
                                <button className="btn-icon btn-edit">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
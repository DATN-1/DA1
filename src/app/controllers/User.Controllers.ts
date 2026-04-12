import { getUserInfo } from '@/app/models/user.model';

export async function fetchUserInfoController() {
    try {
        const UserInfo = await getUserInfo();
        return Response.json(UserInfo);
    } catch (error: any) {
        console.error('[fetchUserInfoController]', error?.message);
        return Response.json({ success: false, error: error?.message ?? 'Lỗi danh sách khách hàng' }, { status: 500 });
    }
}
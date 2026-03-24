import { fetchUserInfoController } from '@/app/controllers/User.Controllers';

export async function getUserInfoService() {
    const UserInfo = await fetchUserInfoController();
    return UserInfo;
}
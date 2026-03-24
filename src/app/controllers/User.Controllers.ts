import { getUserInfo } from '@/app/models/user.model';

export async function fetchUserInfoController() {
    const UserInfo = await getUserInfo();
    return UserInfo;
}
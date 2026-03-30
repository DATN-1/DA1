import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function assertAdminSession() {
  const session = await getServerSession(authOptions as any);
  const role = (session as any)?.user?.role;

  if (!session) {
    return { ok: false as const, status: 401, message: 'Bạn chưa đăng nhập' };
  }

  if (role !== 'admin') {
    return { ok: false as const, status: 403, message: 'Bạn không có quyền quản trị' };
  }

  return { ok: true as const };
}

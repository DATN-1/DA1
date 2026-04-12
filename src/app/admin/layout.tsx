import Sidebar from "@/app/admin/components/Sidebar";
import Topbar from "@/app/admin/components/TopBar";
import "@/style/admin.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type SessionLikeUser = {
  role?: string;
};

async function hasAdminAccess() {
  const cookieStore = await cookies();
  const userSessionCookie = cookieStore.get("user-session")?.value;

  if (userSessionCookie) {
    try {
      const user = JSON.parse(userSessionCookie) as SessionLikeUser;
      if (user?.role === "admin") {
        return true;
      }
    } catch {
      try {
        const user = JSON.parse(decodeURIComponent(userSessionCookie)) as SessionLikeUser;
        if (user?.role === "admin") {
          return true;
        }
      } catch {
        // Ignore invalid cookie and continue with NextAuth session check.
      }
    }
  }

  const session = await getServerSession(authOptions as any);
  return (session as any)?.user?.role === "admin";
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allowed = await hasAdminAccess();
  if (!allowed) {
    redirect("/login");
  }

  return (
    <div className="admin-shell flex">
      <Sidebar />
      <div className="main-content flex-1">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
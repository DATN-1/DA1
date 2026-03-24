import Sidebar from "@/app/admin/components/Sidebar";
import Topbar from "@/app/admin/components/TopBar";
import "@/style/admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content flex-1">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
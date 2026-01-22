import { AdminSidebar } from "@/components/admin-sidebar";
import { StoreHydrationProvider } from "@/components/store-hydration-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background">
        <StoreHydrationProvider>
          {children}
        </StoreHydrationProvider>
      </main>
    </div>
  );
}

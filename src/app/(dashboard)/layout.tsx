import { Navbar } from "@/components/shared/navbar";
import { Sidebar } from "@/components/shared/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <Sidebar />
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

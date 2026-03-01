import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Maids for Care",
  description: "Admin panel for Maids for Care platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - MaidEase",
  description: "Admin panel for MaidEase platform",
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
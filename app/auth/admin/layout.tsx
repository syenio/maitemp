import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - MaidEase",
  description: "Admin authentication for MaidEase platform",
};

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-auth-layout">
      {children}
    </div>
  );
}
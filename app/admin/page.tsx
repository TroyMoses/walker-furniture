import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user has admin role in their public metadata
  const isAdmin = user.publicMetadata?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminDashboard />;
}

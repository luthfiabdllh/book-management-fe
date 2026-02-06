import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to books page as the main dashboard
  redirect("/books");
}

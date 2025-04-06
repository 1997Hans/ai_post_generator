import { Suspense } from "react";
import DashboardContent from "@/components/dashboard-content";
import DashboardLoading from "@/components/dashboard-loading";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Title for the dashboard
export const metadata = {
  title: "Post Management Dashboard | Social Media Post Generator",
  description: "Manage and monitor your social media posts"
};

export default function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // We won't access searchParams at all in the server component
  // Let the client component handle everything
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        Post Management Dashboard
      </h1>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </main>
  );
} 
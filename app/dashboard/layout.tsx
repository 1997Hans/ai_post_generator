import { StarField } from "@/components/star-field";

export const metadata = {
  title: "Dashboard | Social Media Post Generator",
  description: "Manage your social media posts"
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <StarField />
      {children}
    </div>
  );
} 
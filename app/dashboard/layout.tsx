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
    <div className="relative z-10">
      {children}
    </div>
  );
} 
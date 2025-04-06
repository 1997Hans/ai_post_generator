import { Header } from "@/components/header";
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
    <main style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "#0a081a" 
    }}>
      <StarField />
      <Header />
      <div style={{ 
        flex: 1, 
        position: "relative",
        zIndex: 10
      }}>
        {children}
      </div>
    </main>
  );
} 
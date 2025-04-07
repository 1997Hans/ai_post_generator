import { ReactNode } from 'react';
import { StarField } from "@/components/star-field";

export default function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(180deg, rgba(10, 8, 26, 0.8) 0%, rgba(10, 8, 26, 1) 100%)"
    }}>
      <StarField />
      {children}
    </div>
  );
} 
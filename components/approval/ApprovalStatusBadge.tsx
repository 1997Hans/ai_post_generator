import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface ApprovalStatusBadgeProps {
  approved: boolean | null;
  variant?: "large" | "detail" | "default";
}

export function ApprovalStatusBadge({ approved, variant = "default" }: ApprovalStatusBadgeProps) {
  // Debug the exact value for troubleshooting
  console.log(`[ApprovalStatusBadge] TYPE: ${typeof approved}, VALUE: ${JSON.stringify(approved)}, Raw: approved=${approved}, variant=${variant}`);
  
  // Determine status and styling based on approved value
  // Force evaluation of boolean to ensure consistent handling
  let status: string;
  let bgColor: string;
  let textColor: string;
  let icon: React.ReactNode;
  
  // Explicitly check for true/false values
  if (approved === true || approved === 'true') {
    // Approved state
    status = "Approved";
    bgColor = "rgba(74, 222, 128, 0.15)";
    textColor = "#16a34a";
    icon = <CheckCircle size={variant === "large" ? 16 : 12} />;
    console.log('[ApprovalStatusBadge] Rendering APPROVED badge');
  } else if (approved === false || approved === 'false') {
    // Rejected state
    status = "Rejected";
    bgColor = "rgba(239, 68, 68, 0.15)";
    textColor = "#ef4444";
    icon = <XCircle size={variant === "large" ? 16 : 12} />;
    console.log('[ApprovalStatusBadge] Rendering REJECTED badge');
  } else {
    // Pending state (null, undefined, or any other value)
    status = "Pending";
    bgColor = "rgba(168, 162, 158, 0.15)";
    textColor = "#78716c";
    icon = <Clock size={variant === "large" ? 16 : 12} />;
    console.log('[ApprovalStatusBadge] Rendering PENDING badge');
  }
  
  const fontSize = variant === "large" ? "14px" : "12px";
  const padding = variant === "large" ? "6px 12px" : "4px 8px";
  const borderRadius = "6px";
  const gap = variant === "large" ? "6px" : "4px";
  const fontWeight = "500";
  
  // Detail variant has a more visible background for the detail page
  if (variant === "detail") {
    bgColor = approved === true ? "rgba(74, 222, 128, 0.2)" : 
              approved === false ? "rgba(239, 68, 68, 0.2)" : 
              "rgba(168, 162, 158, 0.2)";
  }
  
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap,
      backgroundColor: bgColor,
      color: textColor,
      padding,
      borderRadius,
      fontSize,
      fontWeight
    }}>
      {icon}
      {status}
    </div>
  );
} 
"use client";

import { toast } from "sonner";

export function useToast() {
  return {
    toast,
    showSuccess: (message: string, description?: string) => {
      toast.success(message, {
        description
      });
    },
    showError: (message: string, description?: string) => {
      toast.error(message, {
        description
      });
    },
    showWarning: (message: string, description?: string) => {
      toast.warning(message, {
        description
      });
    },
    showInfo: (message: string, description?: string) => {
      toast.info(message, {
        description
      });
    }
  };
} 
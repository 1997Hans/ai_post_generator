import React, { useState } from 'react';

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (feedbackText: string) => void;
  isSubmitting: boolean;
}

export function RejectDialog({ isOpen, onClose, onReject, isSubmitting }: RejectDialogProps) {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "#18162b",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(58, 46, 99, 0.4)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(58, 46, 99, 0.4)"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600"
          }}>Reject Post</h2>
          <p style={{
            fontSize: "14px",
            color: "#a7a3bc",
            marginTop: "4px"
          }}>
            Provide feedback on why this post was rejected
          </p>
        </div>
        
        <div style={{ padding: "24px" }}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback to help improve future content generation..."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              backgroundColor: "rgba(58, 46, 99, 0.2)",
              border: "1px solid rgba(58, 46, 99, 0.4)",
              borderRadius: "4px",
              color: "white",
              fontSize: "14px",
              lineHeight: "1.5",
              resize: "vertical"
            }}
          />
          
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "24px"
          }}>
            <button
              onClick={() => {
                setFeedback('');
                onClose();
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                border: "1px solid rgba(58, 46, 99, 0.4)",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={() => {
                onReject(feedback);
                setFeedback('');
              }}
              disabled={isSubmitting || !feedback.trim()}
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(239, 68, 68, 0.8)",
                border: "none",
                borderRadius: "4px",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: isSubmitting ? "wait" : "pointer",
                opacity: (isSubmitting || !feedback.trim()) ? 0.7 : 1
              }}
            >
              {isSubmitting ? "Rejecting..." : "Submit Rejection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
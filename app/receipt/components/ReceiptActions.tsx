"use client";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/app/receipt/utils/animations";
import { Share, FileDown } from "lucide-react";
import { ReceiptData } from "@/types/receipt";
import { generateReceiptPDF } from "@/lib/pdf";
import { motion } from "framer-motion";
interface ReceiptActionsProps {
  data: ReceiptData["data"];
  orderId: string;
}

const MotionButton = motion.create(Button);

export function ReceiptActions({ data, orderId }: ReceiptActionsProps) {
  const generatePDF = async () => {
    if (!orderId) return;
    await generateReceiptPDF(data, orderId);
  };

  return (
    <div className="flex gap-2">
      <MotionButton
        variant="otter"
        variants={buttonVariants}
        className="flex-1"
        onClick={generatePDF}
      >
        <FileDown className="h-4 w-4" />
        <span className="font-semibold">Save as PDF</span>
      </MotionButton>
      <MotionButton
        variant="otter"
        variants={buttonVariants}
        className="flex-1"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: `${data.restaurantName} Receipt ${new Date(
                data.orderDateTime
              ).toLocaleDateString("en-GB")}`,
              text: `View receipt for ${data.restaurantName} Order #${data.orderNumber}`,
              url: window.location.href,
            });
          }
        }}
      >
        <Share className="h-4 w-4" />
        <span className="font-semibold">Share Receipt</span>
      </MotionButton>
    </div>
  );
}

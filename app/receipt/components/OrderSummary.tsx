"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";
import { ReceiptData } from "@/types/receipt";

const MotionCard = motion(Card);

interface OrderSummaryProps {
  data: ReceiptData["data"];
  onSplitBill: () => void;
}

export function OrderSummary({ data, onSplitBill }: OrderSummaryProps) {
  return (
    <MotionCard variants={cardVariants} className="rounded-xl">
      <CardContent className="space-y-2 py-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {data.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes and Fees</span>
          <span>Rp {data.taxesAndFees.toLocaleString()}</span>
        </div>
        <Separator variant="otter" orientation="horizontal" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>Rp {data.total.toLocaleString()}</span>
        </div>
        <Button variant="otter" className="w-full mt-4" onClick={onSplitBill}>
          <Users className="h-4 w-4" />
          <span className="font-semibold text-black">Split Bill</span>
        </Button>
      </CardContent>
    </MotionCard>
  );
}

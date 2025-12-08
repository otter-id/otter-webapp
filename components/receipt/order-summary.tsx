"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cardVariants } from "@/app/receipt/utils/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ReceiptData } from "@/types/receipt";
import { formatPrice } from "@/utils/client";

const MotionCard = motion.create(Card);

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
          <div className="flex items-start gap-1">
            <span>{formatPrice(data.subtotal)}</span>
          </div>
        </div>
        {data.promotionId && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({data.promoName})</span>
            <span>{formatPrice(data.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatPrice(data.taxesAndFees)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Charge</span>
          <span>{formatPrice(data.service)}</span>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <div className="flex items-center gap-1">
            <span>{formatPrice(data.total)}</span>
          </div>
        </div>
        <Button variant="otter" className="mt-4 w-full" onClick={onSplitBill}>
          <Users className="h-4 w-4" />
          <span className="font-semibold text-black">Split Bill</span>
        </Button>
      </CardContent>
    </MotionCard>
  );
}

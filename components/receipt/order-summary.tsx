"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { cardVariants } from "@/app/receipt/utils/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ReceiptData } from "@/types/receipt";

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
            {data.promotion ? (
              <>
                <span className="text-muted-foreground text-xs line-through">Rp {data.priceBeforePromo?.toLocaleString()}</span>
                <span>Rp {data.subtotal.toLocaleString()}</span>
              </>
            ) : (
              <span>Rp {data.subtotal.toLocaleString()}</span>
            )}
          </div>
        </div>
        {data.promotion && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-green-600">
              <span>Discount ({data.promotion.name})</span>
              <span>-Rp {data.promotion.discountValue.toLocaleString()}</span>
            </div>
            {data.promotion.minTransaction > 0 && (
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Min. Transaction</span>
                <span>Rp {data.promotion.minTransaction.toLocaleString()}</span>
              </div>
            )}
            {data.promotion.maxDiscount > 0 && (
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Max. Discount</span>
                <span>Rp {data.promotion.maxDiscount.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>Rp {data.taxesAndFees.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Charge</span>
          <span>Rp {data.service.toLocaleString()}</span>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <div className="flex items-start gap-1">
            {data.promotion ? (
              <>
                <span className="text-muted-foreground text-xs line-through">
                  Rp {((data.priceBeforePromo || 0) + data.taxesAndFees + data.service).toLocaleString()}
                </span>
                <span>Rp {data.total.toLocaleString()}</span>
              </>
            ) : (
              <span>Rp {data.total.toLocaleString()}</span>
            )}
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

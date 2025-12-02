"use client";

import { motion } from "framer-motion";
import { cardVariants } from "@/app/receipt/utils/animations";
import { Card, CardContent } from "@/components/ui/card";
import type { ReceiptData } from "@/types/receipt";

const MotionCard = motion(Card);

interface PointsCardProps {
  data: ReceiptData["data"];
}

export function PointsCard({ data }: PointsCardProps) {
  return (
    <MotionCard variants={cardVariants} className="rounded-xl border-yellow-100 bg-gradient-to-br from-yellow-100 to-amber-300">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-yellow-700">Points Earned</h3>
            <p className="font-medium text-sm text-yellow-600">Keep collecting for rewards!</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-3xl text-yellow-600">{data.pointsEarned}</span>
            <span className="text-3xl">{data.emoji}</span>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
}

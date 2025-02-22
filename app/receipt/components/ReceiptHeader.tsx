"use client";

import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";
import { ReceiptData } from "@/types/receipt";

const MotionCard = motion.create(Card);

interface ReceiptHeaderProps {
  data: ReceiptData["data"];
}

export function ReceiptHeader({ data }: ReceiptHeaderProps) {
  const orderDate = new Date(data.orderDateTime);

  return (
    <MotionCard variants={cardVariants} className="rounded-xl">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Image
          src={data.restaurantLogo || "/placeholder.svg"}
          alt={data.restaurantName}
          width={60}
          height={60}
          className="rounded-full"
          draggable={false}
        />
        <div>
          <CardTitle className="text-xl">{data.restaurantName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.restaurantAddress}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-5xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-600">
            #{data.orderNumber}
          </p>
          <p className="text-2xl font-medium mb-2">{data.firstName}</p>
          <p className="text-sm text-muted-foreground">
            {format(orderDate, "PPpp")}
          </p>
        </div>
      </CardContent>
    </MotionCard>
  );
}

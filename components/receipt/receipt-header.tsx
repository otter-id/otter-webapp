"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { cardVariants } from "@/app/receipt/utils/animations";
import OrderStepper from "@/components/receipt/order-stepper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReceiptData } from "@/types/receipt";

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
          onDragStart={(event) => event.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          src={data.restaurantLogo || "/placeholder/placeholder.svg"}
          alt={data.restaurantName}
          width={60}
          height={60}
          className="rounded-full"
          draggable={false}
        />
        <div>
          <CardTitle className="text-xl">{data.restaurantName}</CardTitle>
          <p className="text-muted-foreground text-sm">{data.restaurantAddress}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="py-4 text-center">
          <p className="mb-1 font-bold text-5xl text-[#F2C94C]">#{data.orderNumber}</p>
          <Badge
            variant={data.status === "PAID" ? "default" : "secondary"}
            className={`mb-2 ${data.status === "PAID" ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
          >
            {data.status}
          </Badge>
          <p className="mb-2 font-semibold text-2xl">{data.firstName}</p>
          <p className="text-muted-foreground text-sm">{format(orderDate, "d MMM yyyy | HH:mm")}</p>
        </div>
        <OrderStepper orderStatus={data.orderStatus} paymentStatus={data.status} />
      </CardContent>
    </MotionCard>
  );
}

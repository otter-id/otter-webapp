"use client";

import { format } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cardVariants } from "@/app/receipt/utils/animations";
import { ReceiptData } from "@/types/receipt";
import OrderStepper from "@/components/receipt/order-stepper";
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
          <p className="text-sm text-muted-foreground">
            {data.restaurantAddress}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-5xl font-bold mb-1 text-[#F2C94C]">
            #{data.orderNumber}
          </p>
          <Badge
            variant={data.status === "PAID" ? "default" : "secondary"}
            className={`mb-2 ${data.status === "PAID"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : ""
              }`}
          >
            {data.status}
          </Badge>
          <p className="text-2xl font-semibold mb-2">{data.firstName}</p>
          <p className="text-sm text-muted-foreground">
            {format(orderDate, "d MMM yyyy | HH:mm")}
          </p>
        </div>
        <OrderStepper
          orderStatus={data.orderStatus}
          paymentStatus={data.status}
        />
      </CardContent>
    </MotionCard>
  );
}

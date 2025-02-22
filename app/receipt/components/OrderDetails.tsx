"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";
import { ReceiptData } from "@/types/receipt";

const MotionCard = motion(Card);

interface OrderDetailsProps {
  data: ReceiptData["data"];
}

export function OrderDetails({ data }: OrderDetailsProps) {
  return (
    <MotionCard variants={cardVariants} className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            <div className="flex space-x-4">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={96}
                height={80}
                className="w-24 h-20 object-cover rounded-md flex-shrink-0"
                draggable={false}
              />
              <div className="flex-grow space-y-1">
                <div className="flex justify-between items-start">
                  <span
                    className="font-medium pr-2 break-words"
                    style={{ maxWidth: "calc(100% - 80px)" }}
                  >
                    {item.name}
                  </span>
                  <span className="whitespace-nowrap">
                    Rp {item.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                <div className="space-y-1">
                  {item.modifiers.map((modifier, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-muted-foreground"
                    >
                      <span className="pr-2">{modifier.name}</span>
                      {modifier.price > 0 && (
                        <span className="whitespace-nowrap">
                          +Rp {modifier.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {index < data.items.length - 1 && (
              <Separator orientation="horizontal" variant="otter" />
            )}
          </motion.div>
        ))}
      </CardContent>
    </MotionCard>
  );
}

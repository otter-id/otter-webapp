"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Phone, Info, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";
import { ReceiptData } from "@/types/receipt";

const MotionCard = motion(Card);

interface PickupInfoProps {
  data: ReceiptData["data"];
}

export function PickupInfo({ data }: PickupInfoProps) {
  return (
    <MotionCard variants={cardVariants} className="rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg">Pickup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Store className="h-5 w-5 text-amber-400" />
          <div>
            <p className="font-bold">Store Location</p>
            <p className="text-sm text-muted-foreground">
              {data.restaurantAddress}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-amber-400" />
          <div>
            <p className="font-bold">Store Phone</p>
            <p className="text-sm text-muted-foreground">{data.phoneNumber}</p>
          </div>
        </div>
        {data.pickupInstructions && (
          <div className="flex items-start space-x-3">
            <Info className="h-8 w-8 text-amber-400" />
            <div>
              <p className="font-bold">Pickup Instructions</p>
              <p className="text-sm text-muted-foreground">
                {data.pickupInstructions}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="otter"
          className="w-full"
          onClick={() => window.open(data.googleMapsUrl, "_blank")}
        >
          <MapPin className="h-4 w-4" />
          <span className="font-semibold">Get Directions</span>
        </Button>
      </CardContent>
    </MotionCard>
  );
}

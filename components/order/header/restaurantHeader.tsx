"use client";

import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface RestaurantHeaderProps {
  name: string;
  logo: string;
  waitTime: number;
  isOpen: boolean;
  openingTimes?: {
    [key: string]: {
      openTime: string;
      closeTime: string;
    }[];
  };
}

export function RestaurantHeader({
  name,
  logo,
  waitTime,
  isOpen,
  openingTimes,
}: RestaurantHeaderProps) {
  const [showHours, setShowHours] = useState(false);

  // Calculate wait time status and color
  const getWaitTimeStatus = (minutes: number) => {
    if (minutes <= 10) return { label: "Short", color: "bg-green-500" };
    if (minutes <= 20) return { label: "Average", color: "bg-yellow-500" };
    return { label: "Long", color: "bg-red-500" };
  };

  const waitTimeStatus = getWaitTimeStatus(waitTime);

  // Get current day for highlighting
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Format time from ISO string to readable format
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  // Convert API openingTimes to a more readable format
  const dayMapping = {
    Monday: "MON",
    Tuesday: "TUE",
    Wednesday: "WED",
    Thursday: "THU",
    Friday: "FRI",
    Saturday: "SAT",
    Sunday: "SUN",
  };

  const openingHours = [
    {
      day: "Monday",
      hours: openingTimes?.[dayMapping["Monday"]]?.length
        ? `${formatTime(
            openingTimes[dayMapping["Monday"]][0].openTime
          )} - ${formatTime(openingTimes[dayMapping["Monday"]][0].closeTime)}`
        : "Closed",
    },
    {
      day: "Tuesday",
      hours: openingTimes?.[dayMapping["Tuesday"]]?.length
        ? `${formatTime(
            openingTimes[dayMapping["Tuesday"]][0].openTime
          )} - ${formatTime(openingTimes[dayMapping["Tuesday"]][0].closeTime)}`
        : "Closed",
    },
    {
      day: "Wednesday",
      hours: openingTimes?.[dayMapping["Wednesday"]]?.length
        ? `${formatTime(
            openingTimes[dayMapping["Wednesday"]][0].openTime
          )} - ${formatTime(
            openingTimes[dayMapping["Wednesday"]][0].closeTime
          )}`
        : "Closed",
    },
    {
      day: "Thursday",
      hours: openingTimes?.[dayMapping["Thursday"]]?.length
        ? `${formatTime(
            openingTimes[dayMapping["Thursday"]][0].openTime
          )} - ${formatTime(openingTimes[dayMapping["Thursday"]][0].closeTime)}`
        : "Closed",
    },
    {
      day: "Friday",
      hours: openingTimes?.[dayMapping["Friday"]]?.length
        ? `${formatTime(
            openingTimes[dayMapping["Friday"]][0].openTime
          )} - ${formatTime(openingTimes[dayMapping["Friday"]][0].closeTime)}`
        : "Closed",
    },
    {
      day: "Saturday",
      hours: openingTimes?.[dayMapping["Saturday"]]?.length
        ? `${formatTime(
            openingTimes[dayMapping["Saturday"]][0].openTime
          )} - ${formatTime(openingTimes[dayMapping["Saturday"]][0].closeTime)}`
        : "Closed",
    },
    {
      day: "Sunday",
      hours: openingTimes?.[dayMapping["Sunday"]]?.length
        ? `${formatTime(
            openingTimes[dayMapping["Sunday"]][0].openTime
          )} - ${formatTime(openingTimes[dayMapping["Sunday"]][0].closeTime)}`
        : "Closed",
    },
  ];

  return (
    <>
      <div className="relative pb-4">
        {/* Hero Image */}
        <div className="h-48 relative bg-muted">
          <Image
            src="/placeholder/placeholder.svg?height=192&width=448"
            alt="Restaurant banner"
            fill
            className="object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        </div>

        {/* Floating Card */}
        <motion.div
          className="relative mx-4 -mt-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            {/* Restaurant Info */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-muted relative flex-shrink-0">
                <Image
                  src={logo || "/placeholder/placeholder.svg"}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="pt-2">
                    <h1 className="text-xl font-bold">{name}</h1>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">4.8</span>
                      </div>
                      <span className="text-muted-foreground">
                        (2.3k reviews)
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-normal mt-2">
                      $$ • Bubble Tea
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Info */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium">
                    {isOpen ? "Open Now" : "Closed"}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-muted-foreground">Closes at 19:00</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>2.5 km away</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <span>{waitTime} mins</span>
                    <div
                      className={`w-2 h-2 rounded-full ${waitTimeStatus.color}`}
                    />
                    <span className="text-muted-foreground">
                      {waitTimeStatus.label} wait
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 h-9">
                  Open in Google Maps
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-9"
                  onClick={() => setShowHours(true)}
                >
                  See Hours
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Opening Hours Dialog */}
      <Dialog open={showHours} onOpenChange={setShowHours}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Opening Hours
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {openingHours.map((schedule, index) => (
              <div key={schedule.day}>
                <div className="flex justify-between items-center">
                  <span
                    className={
                      schedule.day === currentDay
                        ? "font-black"
                        : "text-muted-foreground"
                    }
                  >
                    {schedule.day}
                  </span>
                  <span
                    className={
                      schedule.day === currentDay
                        ? "font-black"
                        : "text-muted-foreground"
                    }
                  >
                    {schedule.hours}
                  </span>
                </div>
                {index < openingHours.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

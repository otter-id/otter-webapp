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
  image: string;
  googleMapsUrl: string;
  waitTime: number;
  isOpen: boolean;
  timeZone?: string;
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
  image,
  googleMapsUrl,
  waitTime,
  isOpen,
  timeZone,
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
        timeZone: timeZone
      });
    } catch (error) {
      return "Invalid time";
    }
  };

  const dayMapping = {
    Monday: "MON",
    Tuesday: "TUE",
    Wednesday: "WED",
    Thursday: "THU",
    Friday: "FRI",
    Saturday: "SAT",
    Sunday: "SUN",
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const openingHours = daysOfWeek.map((day) => {
    const dayKey = dayMapping[day as keyof typeof dayMapping];
    const periods = openingTimes?.[dayKey];

    if (periods && periods.length > 0) {
      return {
        day: day,
        hours: periods.map(
          (period) => `${formatTime(period.openTime)} - ${formatTime(period.closeTime)}`
        ),
      };
    } else {
      return {
        day: day,
        hours: ["Closed"],
      };
    }
  });

  return (
    <>
      <div className="relative pb-4">
        {/* Hero Image */}
        <div className="h-48 relative bg-muted">
          <Image
            onDragStart={(event)=> event.preventDefault()}
            src={image}
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
                  onDragStart={(event)=> event.preventDefault()}
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
                    {/* <div className="flex items-center gap-1 mt-1 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">4.8</span>
                      </div>
                      <span className="text-muted-foreground">
                        (2.3k reviews)
                      </span>
                    </div> */}
                    <Badge variant="secondary" className="font-normal mt-2">
                      Bubble Tea
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
                    className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
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
                <Button
                  variant="outline"
                  className="flex-1 h-9"
                  onClick={() => window.open(googleMapsUrl, "_blank")}>
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
                <div className="flex justify-between items-start">
                  <span
                    className={
                      schedule.day === currentDay
                        ? "font-black"
                        : "text-muted-foreground"
                    }
                  >
                    {schedule.day}
                  </span>
                  {/* Ganti span menjadi div untuk menampung beberapa baris jadwal */}
                  <div
                    className={
                      schedule.day === currentDay
                        ? "font-black text-left"
                        : "text-muted-foreground text-left"
                    }
                  >
                    {/* Lakukan map pada array `schedule.hours` */}
                    {schedule.hours.map((timeSlot, i) => (
                      <div key={i}>{timeSlot}</div>
                    ))}
                  </div>
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

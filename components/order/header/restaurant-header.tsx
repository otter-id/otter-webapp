"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface RestaurantHeaderProps {
  name: string;
  logo: string;
  image: string;
  googleMapsUrl: string;
  location: string;
  waitTime: number;
  isOpen: boolean;
  timeZone?: string;
  openingTimes?: {
    [key: string]: {
      openTime: string | null;
      closeTime: string | null;
    }[];
  };

  restaurantLat: number;
  restaurantLng: number;
}

export function RestaurantHeader({
  name,
  logo,
  image,
  googleMapsUrl,
  location,
  waitTime,
  isOpen,
  timeZone,
  openingTimes,
  restaurantLat,
  restaurantLng,
}: RestaurantHeaderProps) {
  const [showHours, setShowHours] = useState(false);

  // === GEO ===
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [_geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        setGeoError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 1000 * 60 * 5,
      },
    );
  }, []);

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} m away`;
    }
    return `${km.toFixed(1)} km away`;
  };

  let distanceText = "See on map";
  if (userPosition) {
    const distanceKm = getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, restaurantLat, restaurantLng);
    distanceText = formatDistance(distanceKm);
  }

  // === WAIT TIME ===
  const getWaitTimeStatus = (minutes: number) => {
    if (minutes <= 10) return { label: "Short", color: "bg-green-500" };
    if (minutes <= 20) return { label: "Average", color: "bg-yellow-500" };
    return { label: "Long", color: "bg-red-500" };
  };
  const waitTimeStatus = getWaitTimeStatus(waitTime);

  // === OPENING TIMES ===
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: timeZone,
      });
    } catch (_error) {
      return "";
    }
  };

  const dayMapping: Record<string, string> = {
    Monday: "MON",
    Tuesday: "TUE",
    Wednesday: "WED",
    Thursday: "THU",
    Friday: "FRI",
    Saturday: "SAT",
    Sunday: "SUN",
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // ini buat dialog
  const openingHours = daysOfWeek.map((day) => {
    const dayKey = dayMapping[day];
    const periods = openingTimes?.[dayKey];

    if (periods && periods.length > 0) {
      return {
        day: day,
        hours: periods.map((period) => {
          const open = period.openTime ? formatTime(period.openTime) : "—";
          const close = period.closeTime ? formatTime(period.closeTime) : "—";
          return `${open} - ${close}`;
        }),
      };
    } else {
      return {
        day: day,
        hours: ["Closed"],
      };
    }
  });

  // === ini bagian closes at di header ===
  // ambil jadwal hari ini
  const todayKey = dayMapping[currentDay];
  const todayPeriods = openingTimes?.[todayKey];
  let closesAtText: string | null = null;

  if (todayPeriods && todayPeriods.length > 0) {
    // ambil period terakhir (kalau 2 shift)
    const lastPeriod = todayPeriods[todayPeriods.length - 1];
    if (lastPeriod?.closeTime) {
      const formatted = formatTime(lastPeriod.closeTime);
      if (formatted) {
        closesAtText = `Closes at ${formatted}`;
      }
    } else {
      // di DB null → bisa pilih: sembunyiin aja
      closesAtText = null;
      // atau kalau mau keliatan:
      // closesAtText = "Closing time not set";
    }
  } else {
    // hari ini closed semua
    closesAtText = "Closed today";
  }

  return (
    <>
      <div className="relative pb-4">
        {/* Hero Image */}
        <div className="relative h-48 bg-muted">
          <Image
            onDragStart={(event) => event.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            src={image}
            alt="Restaurant banner"
            fill
            className="object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        </div>

        {/* Floating Card */}
        <motion.div className="-mt-24 relative mx-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-lg">
            {/* Restaurant Info */}
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                <Image
                  onDragStart={(event) => event.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  src={logo || "/placeholder/placeholder.svg"}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="pt-2">
                    <h1 className="font-bold text-xl">{name}</h1>
                    <h1 className="text-muted-foreground">{location}</h1>
                    {/* <div className="flex items-center gap-1 mt-1 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">4.8</span>
                      </div>
                      <span className="text-muted-foreground">
                        (2.3k reviews)
                      </span>
                    </div> */}
                    {/* <Badge variant="secondary" className="font-normal mt-2">
                      Bubble Tea
                    </Badge> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Info */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isOpen ? "animate-pulse bg-green-500" : "bg-red-500"}`} />
                  <span className="font-medium">{isOpen ? "Open Now" : "Closed"}</span>
                  {/* bullet */}
                  {closesAtText && (
                    <>
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-muted-foreground">{closesAtText}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{distanceText}</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <span>{waitTime} mins</span>
                    <div className={`h-2 w-2 rounded-full ${waitTimeStatus.color}`} />
                    <span className="text-muted-foreground">{waitTimeStatus.label} wait</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="h-9 flex-1" onClick={() => window.open(googleMapsUrl, "_blank")}>
                  Open in Google Maps
                </Button>
                <Button variant="outline" className="h-9 flex-1" onClick={() => setShowHours(true)}>
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
              <Clock className="h-4 w-4" />
              Opening Hours
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {openingHours.map((schedule, index) => (
              <div key={schedule.day}>
                <div className="flex items-start justify-between">
                  <span className={schedule.day === currentDay ? "font-black" : "text-muted-foreground"}>{schedule.day}</span>
                  <div className={schedule.day === currentDay ? "text-left font-black" : "text-left text-muted-foreground"}>
                    {schedule.hours.map((timeSlot, i) => (
                      <div key={i}>{timeSlot}</div>
                    ))}
                  </div>
                </div>
                {index < openingHours.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

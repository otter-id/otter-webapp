"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";

interface LocationConfirmationDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    restaurant: Restaurant | null;
    onConfirm: () => void;
}

export function LocationConfirmationDialog({
    isOpen,
    onOpenChange,
    restaurant,
    onConfirm,
}: LocationConfirmationDialogProps) {
    if (!restaurant) return null;

    const handleConfirm = () => {
        onOpenChange(false);
        onConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm p-0 [&>button]:hidden">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="flex items-center justify-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        Confirm Location
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Please confirm your pickup location before proceeding to payment
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="h-4 w-4" />
                                <span>{restaurant.location}</span>
                            </div>
                            {restaurant.address && (
                                <p className="text-sm text-gray-600 ml-6">{restaurant.address}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">
                                    {restaurant.isOpen ? (
                                        <span className="text-green-600 font-medium">Open</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Closed</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                    <Button
                        onClick={handleConfirm}
                        className="w-full bg-black hover:bg-black/90"
                        disabled={!restaurant.isOpen}
                    >
                        {restaurant.isOpen ? "Confirm & Continue to Payment" : "Restaurant is Closed"}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
export interface ReceiptData {
  data: {
    restaurantName: string;
    restaurantLogo: string;
    restaurantAddress: string;
    emoji: string;
    orderDateTime: string;
    orderNumber: string;
    firstName: string;
    status: "PAID" | "UNPAID";
    orderStatus: "ONGOING" | "READY" | "FINISHED" | "REFUNDED";
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image: string;
      notes: string;
      modifiers: Array<{
        name: string;
        price: number;
      }>;
    }>;
    subtotal: number;
    taxesAndFees: number;
    service: number;
    total: number;
    pointsEarned: number;
    paymentMethod: string;
    phoneNumber: string;
    pickupInstructions?: string;
    googleMapsUrl: string;
  };
}

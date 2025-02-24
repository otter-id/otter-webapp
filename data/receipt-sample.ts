import { ReceiptData } from "@/types/receipt";

export const fakeData: ReceiptData = {
  data: {
    restaurantName: "Sharetea",
    restaurantLogo:
      "https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png",
    restaurantAddress: "Mal Taman Anggrek",
    emoji: "🧋",
    orderDateTime: "2025-01-10T21:14:53.020+00:00",
    orderNumber: "A01",
    firstName: "Meisy",
    items: [
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
    ],
    subtotal: 248500,
    taxesAndFees: 0,
    total: 248500,
    pointsEarned: 1,
    paymentMethod: "QR_CODE",
    phoneNumber: "0215658406",
    pickupInstructions:
      "Please show your number on your device to one of the team members for pickup. Thank you",
    googleMapsUrl:
      "https://www.google.com/maps/place/Sharetea/@-6.221919,106.828125,15z/data=!4m2!3m1!1s0x2e69f199e229c78f:0x2e69f199e229c78f",
  },
};

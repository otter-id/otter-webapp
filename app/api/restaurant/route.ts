import { NextResponse } from "next/server";

// This is a mock API endpoint that returns the restaurant data
// In a real application, this would fetch data from your backend
export async function GET() {
  // Simulating API response delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    data: {
      name: "Sharetea",
      location: "Mal Taman Anggrek",
      latitude: -6.1773405931255,
      longitude: 106.79128929521,
      image:
        "http://34.81.222.105/v1/storage/buckets/673950ca001e44cd0d28/files/67c480fd000008a2700c/view?project=679f99e00018a0a10d4a",
      logo: "https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png",
      tag: "u50k",
      pointValue: 20000,
      busyMode: "normal",
      normalWaitTime: 15,
      rushWaitTime: 25,
      emoji: "🧋",
      isOpen: true,
      phoneNumber: "+6281234567890",
      pickupInstructions: null,
      googleMapsUrl: null,
      waitTime: 5,
      address: "Jalan Share Tea",
      timezone: "Asia/Jakarta",
      $id: "675c6c400035d189ce4a",
      openingTimes: {
        MON: [
          {
            openTime: "2025-03-06T03:00:01.437+00:00",
            closeTime: "2025-03-06T14:00:01.446+00:00",
          },
        ],
        TUE: [
          {
            openTime: "2025-03-06T02:00:01.446+00:00",
            closeTime: "2025-03-06T14:00:01.446+00:00",
          },
        ],
        WED: [
          {
            openTime: "2025-03-06T02:00:01.446+00:00",
            closeTime: "2025-03-06T14:00:01.446+00:00",
          },
        ],
        THU: [
          {
            openTime: "2025-03-06T02:00:01.446+00:00",
            closeTime: "2025-03-06T14:00:01.446+00:00",
          },
        ],
        FRI: [
          {
            openTime: "2025-03-06T02:00:01.446+00:00",
            closeTime: "2025-03-06T14:00:01.446+00:00",
          },
        ],
        SAT: [
          {
            openTime: "2025-03-06T02:00:01.446+00:00",
            closeTime: "2025-03-06T14:00:01.446+00:00",
          },
        ],
        SUN: [
          {
            openTime: "2025-03-06T02:00:01.446+00:00",
            closeTime: "2025-03-06T14:00:01.446+00:00",
          },
        ],
      },
      menuCategoryId: [
        {
          name: "Milk Tea Series",
          index: null,
          $id: "67a92a4300362267e308",
          menuId: [
            {
              name: "Taro Milk Tea",
              description: "Teh susu taro dengan rasa manis dan krimi",
              price: 23000,
              image:
                "https://fullofplants.com/wp-content/uploads/2022/03/creamy-vegan-taro-milk-tea-with-boba-thumb-2.jpg",
              isRecommended: true,
              isInStock: true,
              sku: null,
              pointPrice: null,
              outstock: null,
              $id: "675c70af0032535de5a0",
              menuOptionCategory: [
                {
                  name: "Ice Level",
                  isRequired: true,
                  maxAmount: 1,
                  type: "radio",
                  minAmount: null,
                  $id: "675c6e62002d4e531ceb",
                  menuOptionId: [
                    {
                      name: "Normal",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 3,
                      $id: "675c6e61003e0ef6d12b",
                    },
                    {
                      name: "Less Ice",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 2,
                      $id: "675c6e61003de6263ae6",
                    },
                    {
                      name: "Little Ice",
                      description: null,
                      price: 2000,
                      isInStock: true,
                      index: 1,
                      $id: "675c6e61003dcd1b67a7",
                    },
                    {
                      name: "No Ice",
                      description: null,
                      price: 0,
                      isInStock: true,
                      index: 0,
                      $id: "675c6e61003d552ac112",
                    },
                  ],
                },
              ],
            },
            {
              name: "Matcha Milk Tea",
              description: "Teh susu matcha segar dan kaya rasa",
              price: 26000,
              image:
                "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
              isRecommended: false,
              isInStock: true,
              sku: null,
              pointPrice: null,
              outstock: null,
              $id: "675c70c80008c3cb0aa5",
              menuOptionCategory: [
                {
                  name: "Ice Level",
                  isRequired: true,
                  maxAmount: 1,
                  type: "radio",
                  minAmount: null,
                  $id: "675c6e62002d4e531ceb",
                  menuOptionId: [
                    {
                      name: "Normal",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 3,
                      $id: "675c6e61003e0ef6d12b",
                    },
                    {
                      name: "Less Ice",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 2,
                      $id: "675c6e61003de6263ae6",
                    },
                    {
                      name: "Little Ice",
                      description: null,
                      price: 2000,
                      isInStock: true,
                      index: 1,
                      $id: "675c6e61003dcd1b67a7",
                    },
                    {
                      name: "No Ice",
                      description: null,
                      price: 0,
                      isInStock: true,
                      index: 0,
                      $id: "675c6e61003d552ac112",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Classic Tea Series",
          index: null,
          $id: "67affa87000121b38a72",
          menuId: [
            {
              name: "Honey Milk Tea",
              description: "Teh susu dengan sentuhan madu yang manis",
              price: 22000,
              image:
                "https://131248217.cdn6.editmysite.com/uploads/1/3/1/2/131248217/s478381384635632615_p51_i1_w1920.jpeg",
              isRecommended: true,
              isInStock: true,
              sku: null,
              pointPrice: 5,
              outstock: null,
              $id: "675c710100161a692557",
              menuOptionCategory: [
                {
                  name: "Ice Level",
                  isRequired: true,
                  maxAmount: 1,
                  type: "radio",
                  minAmount: null,
                  $id: "675c6e62002d4e531ceb",
                  menuOptionId: [
                    {
                      name: "Normal",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 3,
                      $id: "675c6e61003e0ef6d12b",
                    },
                    {
                      name: "Less Ice",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 2,
                      $id: "675c6e61003de6263ae6",
                    },
                    {
                      name: "Little Ice",
                      description: null,
                      price: 2000,
                      isInStock: true,
                      index: 1,
                      $id: "675c6e61003dcd1b67a7",
                    },
                    {
                      name: "No Ice",
                      description: null,
                      price: 0,
                      isInStock: true,
                      index: 0,
                      $id: "675c6e61003d552ac112",
                    },
                  ],
                },
              ],
            },
            {
              name: "Chocolate Milk Tea",
              description: "Teh susu cokelat yang lezat dan nikmat",
              price: 21000,
              image:
                "https://entirelyelizabeth.com/wp-content/uploads/2022/11/IMG_1811-2.jpg",
              isRecommended: false,
              isInStock: true,
              sku: null,
              pointPrice: null,
              outstock: null,
              $id: "675c714b00287279a3af",
              menuOptionCategory: [
                {
                  name: "Ice Level",
                  isRequired: true,
                  maxAmount: 1,
                  type: "radio",
                  minAmount: null,
                  $id: "675c6e62002d4e531ceb",
                  menuOptionId: [
                    {
                      name: "Normal",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 3,
                      $id: "675c6e61003e0ef6d12b",
                    },
                    {
                      name: "Less Ice",
                      description: null,
                      price: 3000,
                      isInStock: true,
                      index: 2,
                      $id: "675c6e61003de6263ae6",
                    },
                    {
                      name: "Little Ice",
                      description: null,
                      price: 2000,
                      isInStock: true,
                      index: 1,
                      $id: "675c6e61003dcd1b67a7",
                    },
                    {
                      name: "No Ice",
                      description: null,
                      price: 0,
                      isInStock: true,
                      index: 0,
                      $id: "675c6e61003d552ac112",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });
}

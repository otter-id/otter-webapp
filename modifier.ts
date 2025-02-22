export const modifierCategories = ["Ice Level", "Sugar Level", "Size", "Extra Toppings", "Tea Base"]

export const modifiers = {
  "Ice Level": [
    {
      id: 1,
      name: "No Ice",
      price: 0,
      default: false,
    },
    {
      id: 2,
      name: "Less Ice",
      price: 0,
      default: false,
    },
    {
      id: 3,
      name: "Normal Ice",
      price: 0,
      default: true,
    },
    {
      id: 4,
      name: "Extra Ice",
      price: 2000,
      default: false,
    },
  ],
  "Sugar Level": [
    {
      id: 5,
      name: "No Sugar (0%)",
      price: 0,
      default: false,
    },
    {
      id: 6,
      name: "Light Sugar (25%)",
      price: 0,
      default: false,
    },
    {
      id: 7,
      name: "Half Sugar (50%)",
      price: 0,
      default: false,
    },
    {
      id: 8,
      name: "Less Sugar (75%)",
      price: 0,
      default: false,
    },
    {
      id: 9,
      name: "Normal Sugar (100%)",
      price: 0,
      default: true,
    },
  ],
  Size: [
    {
      id: 10,
      name: "Regular",
      price: 0,
      default: true,
    },
    {
      id: 11,
      name: "Large",
      price: 4000,
      default: false,
    },
  ],
  "Extra Toppings": [
    {
      id: 12,
      name: "Extra Boba/Pearls",
      price: 5000,
      default: false,
    },
    {
      id: 13,
      name: "Extra Pudding",
      price: 6000,
      default: false,
    },
    {
      id: 14,
      name: "Extra Red Bean",
      price: 6000,
      default: false,
    },
    {
      id: 15,
      name: "Extra Grass Jelly",
      price: 5000,
      default: false,
    },
    {
      id: 16,
      name: "Extra Crystal Boba",
      price: 6000,
      default: false,
    },
    {
      id: 17,
      name: "Extra Egg Pudding",
      price: 7000,
      default: false,
    },
    {
      id: 18,
      name: "Extra Aloe Vera",
      price: 6000,
      default: false,
    },
    {
      id: 19,
      name: "Extra Coconut Jelly",
      price: 5000,
      default: false,
    },
  ],
  "Tea Base": [
    {
      id: 20,
      name: "Regular Tea Base",
      price: 0,
      default: true,
    },
    {
      id: 21,
      name: "Light Tea Base",
      price: 0,
      default: false,
    },
    {
      id: 22,
      name: "Strong Tea Base",
      price: 2000,
      default: false,
    },
  ],
}

export const categoryModifierMapping = {
  "Classic Tea Series": ["Ice Level", "Sugar Level", "Size", "Tea Base"],
  "Milk Tea Series": ["Ice Level", "Sugar Level", "Size", "Extra Toppings", "Tea Base"],
  "Fresh Milk Series": ["Ice Level", "Sugar Level", "Size", "Extra Toppings"],
  "Fruit Tea Series": ["Ice Level", "Sugar Level", "Size", "Extra Toppings", "Tea Base"],
  "Mojito Series": ["Ice Level", "Sugar Level", "Size"],
  "Specialty Drinks": ["Ice Level", "Sugar Level", "Size", "Extra Toppings", "Tea Base"],
  Toppings: [],
}

export const modifierRules = {
  maxToppings: 3,
  incompatibleCombinations: [
    {
      modifier1: "No Ice",
      modifier2: "Extra Ice",
    },
    {
      modifier1: "No Sugar (0%)",
      modifier2: "Normal Sugar (100%)",
    },
  ],
  requiredModifiers: ["Ice Level", "Sugar Level", "Size"],
}


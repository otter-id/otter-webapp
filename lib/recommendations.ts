import type { MenuItem, CartItem } from "@/lib/types"
import { menuItems } from "@/app/sample-data"

// Helper function to get all menu items in a flat array
const getAllMenuItems = () => {
  return Object.values(menuItems).flat()
}

// Get complementary items based on cart contents
export function getRecommendations(cart: CartItem[], limit = 3): MenuItem[] {
  const allItems = getAllMenuItems()
  const cartItemIds = new Set(cart.map((item) => item.id))

  // Simple recommendation logic:
  // 1. If cart has milk tea, recommend toppings
  // 2. If cart has classic tea, recommend milk tea variants
  // 3. If cart has fruit tea, recommend other fruit teas
  // 4. Otherwise, recommend popular items

  const recommendations: MenuItem[] = []

  // Check cart categories
  const cartCategories = new Set(cart.map((item) => item.category))

  if (cartCategories.has("Milk Tea Series")) {
    // Recommend toppings
    recommendations.push(...allItems.filter((item) => item.category === "Toppings" && !cartItemIds.has(item.id)))
  }

  if (cartCategories.has("Classic Tea Series")) {
    // Recommend milk tea variants
    recommendations.push(...allItems.filter((item) => item.category === "Milk Tea Series" && !cartItemIds.has(item.id)))
  }

  if (cartCategories.has("Fruit Tea Series")) {
    // Recommend other fruit teas
    recommendations.push(
      ...allItems.filter((item) => item.category === "Fruit Tea Series" && !cartItemIds.has(item.id)),
    )
  }

  // If we still need more recommendations, add popular items
  if (recommendations.length < limit) {
    const popularItems = allItems.filter(
      (item) => !cartItemIds.has(item.id) && !recommendations.some((rec) => rec.id === item.id),
    )
    recommendations.push(...popularItems)
  }

  // Shuffle and return limited number of recommendations
  return recommendations.sort(() => Math.random() - 0.5).slice(0, limit)
}


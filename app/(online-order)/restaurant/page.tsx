"use client";

import { useState } from "react";
import { RestaurantHeader } from "@/components/layout/restaurant-header";
import { StickyFooter } from "@/components/layout/sticky-footer";
import { CategoryNav } from "@/components/features/menu/category-nav";
import { MenuItem } from "@/components/features/menu/menu-item";
import { CartDrawer } from "@/components/features/cart/cart-drawer";
import { ItemDrawer } from "@/components/features/item/item-drawer";
import { useCart } from "@/hooks/use-cart";
import { useScrollSync } from "@/hooks/use-scroll";
import { categories, menuItems } from "./sample-data";
import { DeleteConfirmation } from "@/components/features/cart/delete-confirmation";
import type { MenuItem as MenuItemType } from "@/lib/types";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { SearchOverlay } from "@/components/features/search/search-overlay";

export default function FoodOrderingPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isItemDrawerOpen, setIsItemDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isFeesExpanded, setIsFeesExpanded] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    cart,
    cartItemCount,
    editingCartItem,
    setEditingCartItem,
    calculateCartTotals,
    addToCart,
    updateCartItem,
    updateItemQuantity,
    removeItem,
  } = useCart();

  const {
    categoryRefs,
    categoryButtonsRef,
    scrollContainerRef,
    scrollCategoryIntoView,
  } = useScrollSync({
    onScroll: (category) => {
      console.log("onScroll", category);
      setSelectedCategory(category);
      scrollCategoryIntoView(category);
    },
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
    setIsItemDrawerOpen(true);
  };

  const handleAddToCartWithToast = (item: any) => {
    addToCart(item);
    setIsItemDrawerOpen(false);
    setSelectedItem(null);

    toast("Item added to cart", {
      icon: <Check className="h-4 w-4 text-green-500" />,
      description: `${item.name} has been added to your cart`,
    });
  };

  const handleEditCartItem = (item: any) => {
    const originalItem = menuItems[
      item.category as keyof typeof menuItems
    ].find((menuItem) => menuItem.id === item.id);
    if (originalItem) {
      setSelectedItem(originalItem);
      setEditingCartItem(item);
      setIsItemDrawerOpen(true);
      setIsCartOpen(false);
    }
  };

  const handleDeleteConfirmation = (item: CartItem) => {
    removeItem(item);
    setItemToDelete(null);
    setIsDeleteConfirmOpen(false);
    setIsCartOpen(true);

    toast("Item removed", {
      icon: <X className="h-4 w-4 text-red-500" />,
      description: `${item.name} has been removed from your cart`,
    });
  };

  const handleDeleteRequest = (item: CartItem) => {
    setItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const getItemQuantityInCart = (itemId: number) => {
    return cart.reduce((total, cartItem) => {
      if (cartItem.id === itemId) {
        return total + cartItem.quantity;
      }
      return total;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-[72px]">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        <RestaurantHeader />

        <div className="sticky top-0 z-20">
          <SearchOverlay
            menuItems={menuItems}
            onItemClick={handleItemClick}
            onAddItem={handleAddToCartWithToast}
            addedItems={addedItems}
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen}
            className="border-b shadow-sm"
            getItemQuantityInCart={getItemQuantityInCart}
          />

          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            scrollContainerRef={scrollContainerRef}
            categoryButtonsRef={categoryButtonsRef}
            onCategorySelect={handleCategorySelect}
            className="border-b shadow-sm"
          />
        </div>

        <div className="px-3 py-4 space-y-6">
          {categories.map((category) => (
            <div
              key={category}
              ref={(el) => {
                if (el) {
                  categoryRefs.current[category] = el;
                }
              }}
              data-category={category}
              className="scroll-mt-[145px]" //HERE adjust the scroll margin top to the height of the header
            >
              <h2 className="text-lg font-bold mb-3">{category}</h2>
              <div className="space-y-4">
                {menuItems[category as keyof typeof menuItems].map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    isAdded={addedItems.includes(item.id)}
                    onItemClick={() => handleItemClick(item)}
                    quantity={getItemQuantityInCart(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <StickyFooter
        cartItemCount={cartItemCount}
        cartTotal={calculateCartTotals().total}
        onCartClick={() => setIsCartOpen(true)}
      />

      <ItemDrawer
        isOpen={isItemDrawerOpen}
        onOpenChange={setIsItemDrawerOpen}
        selectedItem={selectedItem}
        editingCartItem={editingCartItem}
        onAddToCart={handleAddToCartWithToast}
        onUpdateCartItem={(item) => {
          updateCartItem(item);
          setIsItemDrawerOpen(false);
          setSelectedItem(null);
          setEditingCartItem(null);
          setIsCartOpen(true);

          toast("Cart updated", {
            icon: <Check className="h-4 w-4 text-green-500" />,
            description: `${item.name} has been updated in your cart`,
          });
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        cart={cart}
        cartItemCount={cartItemCount}
        cartTotals={calculateCartTotals()}
        isFeesExpanded={isFeesExpanded}
        onFeesExpandedChange={setIsFeesExpanded}
        onUpdateQuantity={updateItemQuantity}
        onEditItem={handleEditCartItem}
        onDeleteItem={handleDeleteRequest}
        onAddItem={handleAddToCartWithToast}
        addedItems={addedItems}
      />

      <DeleteConfirmation
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        item={itemToDelete}
        onConfirm={handleDeleteConfirmation}
      />

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        input[type="text"]::-webkit-search-cancel-button,
        input[type="text"]::-webkit-search-decoration {
          -webkit-appearance: none;
          appearance: none;
        }
      `}</style>
    </div>
  );
}

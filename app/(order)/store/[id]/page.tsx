"use client";

import { useState, useEffect } from "react";
import { RestaurantHeader } from "@/components/order/header/restaurantHeader";
import { StickyFooter } from "@/components/order/cart/stickyFooter";
import { CategoryNav } from "@/components/order/menu/categoryNav";
import { MenuItem } from "@/components/order/menu/menuItem";
import { CartDrawer } from "@/components/order/cart/cartDrawer";
import { ItemDrawer } from "@/components/order/item/itemDrawer";
import { useCart } from "@/app/(order)/hooks/useCart";
import { useScrollSync } from "@/app/(order)/hooks/useScroll";
import { useRestaurant } from "@/app/(order)/hooks/useRestaurant";
import { DeleteConfirmation } from "@/components/order/cart/deleteDialog";
import { MenuItem as MenuItemType } from "@/types/restaurant";
import { toast } from "sonner";
import { Check, X, AlertTriangle } from "lucide-react";
import { SearchOverlay } from "@/components/order/search/searchOverlay";
import { Button } from "@/components/ui/button";

import { use } from "react";

export default function FoodOrderingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { loading, error, restaurant, menuCategories } = useRestaurant(id);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isItemDrawerOpen, setIsItemDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isFeesExpanded, setIsFeesExpanded] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
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
    clearCart,
    createCartItemFromMenuItem,
  } = useCart(restaurant);

  // Set the first category as selected once data is loaded
  useEffect(() => {
    if (menuCategories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(menuCategories[0].$id);
    }
  }, [menuCategories, selectedCategoryId]);

  // Handle ItemDrawer open/close
  const handleItemDrawerOpenChange = (isOpen: boolean) => {
    setIsItemDrawerOpen(isOpen);

    // Reset editing state when drawer is closed
    if (!isOpen) {
      setEditingCartItem(null);
    }
  };

  const {
    categoryRefs,
    categoryButtonsRef,
    scrollContainerRef,
    scrollCategoryIntoView,
  } = useScrollSync({
    onScroll: (categoryId) => {
      setSelectedCategoryId(categoryId);
      scrollCategoryIntoView(categoryId);
    },
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    if (categoryRefs.current[categoryId]) {
      categoryRefs.current[categoryId]?.scrollIntoView({
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
    // Find the original menu item
    for (const category of menuCategories) {
      const menuItem = category.menuId.find(
        (menuItem) => menuItem.$id === item.$id
      );
      if (menuItem) {
        setSelectedItem(menuItem);
        setEditingCartItem(item);
        setIsItemDrawerOpen(true);
        setIsCartOpen(false);
        break;
      }
    }
  };

  const handleDeleteConfirmation = (item: any) => {
    removeItem(item);
    setItemToDelete(null);
    setIsDeleteConfirmOpen(false);
    setIsCartOpen(true);

    toast("Item removed", {
      icon: <X className="h-4 w-4 text-red-500" />,
      description: `${item.name} has been removed from your cart`,
    });
  };

  const handleDeleteRequest = (item: any) => {
    setItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const getItemQuantityInCart = (itemId: string) => {
    return cart.reduce((total, cartItem) => {
      if (cartItem.$id === itemId) {
        return total + cartItem.quantity;
      }
      return total;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-sm mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-[72px]">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        <RestaurantHeader
          name={restaurant?.name || ""}
          logo={restaurant?.logo || ""}
          image={restaurant?.image || ""}
          googleMapsUrl={restaurant?.googleMapsUrl || ""}
          waitTime={restaurant?.waitTime || 0}
          isOpen={restaurant?.isOpen || false}
          openingTimes={restaurant?.openingTimes}
        />

        <div className="sticky top-0 z-20">
          <SearchOverlay
            menuItems={menuCategories.flatMap((category) => category.menuId)}
            onItemClick={handleItemClick}
            onAddItem={handleAddToCartWithToast}
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen}
            className="border-b shadow-sm"
            getItemQuantityInCart={getItemQuantityInCart}
          />

          <CategoryNav
            categories={menuCategories.map((cat) => ({
              id: cat.$id,
              name: cat.name,
            }))}
            selectedCategoryId={selectedCategoryId}
            scrollContainerRef={scrollContainerRef}
            categoryButtonsRef={categoryButtonsRef}
            onCategorySelect={handleCategorySelect}
            className="border-b shadow-sm"
          />
        </div>

        <div className="px-3 py-4 space-y-6">
          {menuCategories.map((category) => (
            <div
              key={category.$id}
              ref={(el) => {
                if (el) {
                  categoryRefs.current[category.$id] = el;
                }
              }}
              data-category={category.$id}
              className="scroll-mt-[145px]"
            >
              <h2 className="text-lg font-bold mb-3">{category.name}</h2>
              <div className="space-y-4">
                {category.menuId.map((item, index) => {
                  // Create a unique key for items in the Popular category
                  const isPopularCategory =
                    category.name === "Popular" ||
                    category.$id === "popular-category";
                  const itemKey = isPopularCategory
                    ? `popular-${item.$id}-${index}`
                    : item.$id;

                  return (
                    <MenuItem
                      key={itemKey}
                      item={item}
                      onItemClick={() => handleItemClick(item)}
                      quantity={getItemQuantityInCart(item.$id)}
                      isInPopularCategory={isPopularCategory}
                    />
                  );
                })}
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
        onOpenChange={handleItemDrawerOpenChange}
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
        createCartItemFromMenuItem={createCartItemFromMenuItem}
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
        onClearCart={clearCart}
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

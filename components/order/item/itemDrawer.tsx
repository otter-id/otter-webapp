"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, AlertTriangle, Check } from "lucide-react";
import { MenuItem, MenuOption } from "@/types/restaurant";
import { CartItem } from "@/app/(order)/hooks/useCart";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ItemDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: MenuItem | null;
  editingCartItem: CartItem | null;
  onAddToCart: (item: CartItem) => void;
  onUpdateCartItem: (item: CartItem) => void;
  createCartItemFromMenuItem: (
    menuItem: MenuItem,
    selectedOptions: { [categoryId: string]: MenuOption[] }
  ) => CartItem;
}

export function ItemDrawer({
  isOpen,
  onOpenChange,
  selectedItem,
  editingCartItem,
  onAddToCart,
  onUpdateCartItem,
  createCartItemFromMenuItem,
}: ItemDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{
    [categoryId: string]: MenuOption[];
  }>({});

  // Reset quantity when switching between different items (not when editing)
  useEffect(() => {
    if (!editingCartItem && selectedItem) {
      setQuantity(1);
    }
  }, [selectedItem, editingCartItem]);

  // Set quantity when editing an item
  useEffect(() => {
    if (editingCartItem) {
      setQuantity(editingCartItem.quantity);
    }
  }, [editingCartItem]);

  // Reset states when drawer closes
  useEffect(() => {
    if (!isOpen) {
      if (!editingCartItem) {
        setQuantity(1);
        setSelectedOptions({});
      }
    }
  }, [isOpen, editingCartItem]);

  // Initialize selected options when item changes or when editing
  useEffect(() => {
    if (selectedItem) {
      if (editingCartItem) {
        // Convert from cart format to internal format
        const options: { [categoryId: string]: MenuOption[] } = {};

        Object.entries(editingCartItem.selectedOptions).forEach(
          ([categoryId, cartOptions]) => {
            // Find the original option objects from the menu item
            const category = selectedItem.menuOptionCategory.find(
              (cat) => cat.$id === categoryId
            );
            if (category) {
              options[categoryId] = cartOptions.map((cartOption) => {
                const originalOption = category.menuOptionId.find(
                  (opt) => opt.$id === cartOption.$id
                );
                return (
                  originalOption || {
                    $id: cartOption.$id,
                    name: cartOption.name,
                    price: cartOption.price,
                    description: null,
                    isInStock: true,
                    index: null,
                  }
                );
              });
            }
          }
        );

        setSelectedOptions(options);
      } else {
        // Set default options for required categories
        const defaults: { [categoryId: string]: MenuOption[] } = {};

        selectedItem.menuOptionCategory.forEach((category) => {
          if (category.isRequired && category.menuOptionId.length > 0) {
            // We no longer auto-select options for radio buttons
            if (
              category.type === "check" &&
              category.minAmount &&
              category.minAmount > 0
            ) {
              // For checkboxes with minimum required, select the first minAmount options
              defaults[category.$id] = category.menuOptionId.slice(
                0,
                category.minAmount
              );
            }
          }
        });

        setSelectedOptions(defaults);
      }
    }
  }, [selectedItem, editingCartItem]);

  const handleOptionChange = (
    categoryId: string,
    option: MenuOption,
    isRadio: boolean
  ) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev };

      if (isRadio) {
        // For radio buttons, replace the selection
        newOptions[categoryId] = [option];
      } else {
        // For checkboxes, toggle the selection
        const currentOptions = prev[categoryId] || [];
        const optionExists = currentOptions.some(
          (opt) => opt.$id === option.$id
        );

        if (optionExists) {
          // Remove the option if it exists
          newOptions[categoryId] = currentOptions.filter(
            (opt) => opt.$id !== option.$id
          );
        } else {
          // Add the option if it doesn't exist
          newOptions[categoryId] = [...currentOptions, option];
        }
      }

      return newOptions;
    });
  };

  const isOptionSelected = (categoryId: string, optionId: string): boolean => {
    const options = selectedOptions[categoryId] || [];
    return options.some((option) => option.$id === optionId);
  };

  const calculateTotalPrice = (): number => {
    if (!selectedItem) return 0;

    // Base price of the item
    let total = selectedItem.price;

    // Add the price of all selected options
    Object.values(selectedOptions).forEach((options) => {
      options.forEach((option) => {
        total += option.price;
      });
    });

    // Multiply by quantity
    return total * quantity;
  };

  const isRequiredOptionsMissing = (): boolean => {
    if (!selectedItem) return true;

    return selectedItem.menuOptionCategory.some((category) => {
      if (!category.isRequired) return false;

      const selected = selectedOptions[category.$id] || [];

      if (category.type === "radio") {
        // For radio buttons, one option must be selected
        return selected.length === 0;
      } else if (category.type === "check" && category.minAmount) {
        // For checkboxes, at least minAmount options must be selected
        return selected.length < category.minAmount;
      }

      return false;
    });
  };

  const handleSubmit = () => {
    if (!selectedItem) return;

    const cartItem = createCartItemFromMenuItem(selectedItem, selectedOptions);
    cartItem.quantity = quantity;

    if (editingCartItem) {
      onUpdateCartItem(cartItem);
    } else {
      onAddToCart(cartItem);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh] p-0 max-w-md mx-auto rounded-t-[20px]">
        <div className="h-full overflow-y-auto">
          <DrawerHeader className="px-4 py-3 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <DrawerTitle>Customize Order</DrawerTitle>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          {selectedItem && (
            <div className="px-4 py-6 space-y-6">
              <div className="space-y-4">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={
                      selectedItem.image ||
                      "/placeholder/placeholder.svg?height=448&width=448"
                    }
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                  <p className="text-muted-foreground mt-1">
                    {selectedItem.description}
                  </p>
                  <p className="font-bold mt-2">
                    {formatPrice(selectedItem.price)}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-lg w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Option Categories */}
              {selectedItem.menuOptionCategory.map((category) => (
                <div key={category.$id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.isRequired &&
                      (selectedOptions[category.$id]?.length > 0 ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex gap-1">
                          <Check className="h-3 w-3" />
                          <span>Selected</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 flex gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Required</span>
                        </Badge>
                      ))}
                  </div>

                  {category.type === "radio" ? (
                    <RadioGroup
                      value={selectedOptions[category.$id]?.[0]?.$id || ""}
                      onValueChange={(value) => {
                        const option = category.menuOptionId.find(
                          (opt) => opt.$id === value
                        );
                        if (option) {
                          handleOptionChange(category.$id, option, true);
                        }
                      }}
                    >
                      <div className="space-y-2">
                        {category.menuOptionId.map((option) => (
                          <div
                            key={option.$id}
                            className="flex items-center justify-between py-2 px-3 border rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value={option.$id}
                                id={option.$id}
                              />
                              <Label
                                htmlFor={option.$id}
                                className="cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>
                            {option.price > 0 && (
                              <span className="text-sm font-medium">
                                +{formatPrice(option.price)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {category.menuOptionId.map((option) => (
                        <div
                          key={option.$id}
                          className="flex items-center justify-between py-2 px-3 border rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={option.$id}
                              checked={isOptionSelected(
                                category.$id,
                                option.$id
                              )}
                              onCheckedChange={() => {
                                handleOptionChange(category.$id, option, false);
                              }}
                            />
                            <Label
                              htmlFor={option.$id}
                              className="cursor-pointer"
                            >
                              {option.name}
                            </Label>
                          </div>
                          {option.price > 0 && (
                            <span className="text-sm font-medium">
                              +{formatPrice(option.price)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <DrawerFooter className="border-t sticky bottom-0 bg-white z-10">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!selectedItem || isRequiredOptionsMissing()}
            >
              {editingCartItem
                ? `Update Item • ${formatPrice(calculateTotalPrice())}`
                : `Add to Cart • ${formatPrice(calculateTotalPrice())}`}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, AlertTriangle, Check, Info } from "lucide-react";
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
import { formatPrice, formatTextForPlaceholder } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// Extended MenuItem type to handle JSX elements
interface ExtendedMenuItem extends Omit<MenuItem, "name" | "description"> {
  name: string | JSX.Element;
  description: string | JSX.Element;
}

interface ItemDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: MenuItem | ExtendedMenuItem | null;
  editingCartItem: CartItem | null;
  onAddToCart: (item: CartItem) => void;
  onUpdateCartItem: (item: CartItem) => void;
  createCartItemFromMenuItem: (
    menuItem: MenuItem | ExtendedMenuItem,
    selectedOptions: { [categoryId: string]: MenuOption[] },
    note?: string
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
  const [imageError, setImageError] = useState(false);
  const [note, setNote] = useState("");

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
      setNote(editingCartItem.note || "");
    }
  }, [editingCartItem]);

  // Reset states when drawer closes
  useEffect(() => {
    if (!isOpen) {
      if (!editingCartItem) {
        setQuantity(1);
        setSelectedOptions({});
        setNote("");
      }
      setImageError(false);
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
                    discountPrice: cartOption.discountPrice,
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
        // Don't pre-select any options when adding a new item
        setSelectedOptions({});
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
        if (!newOptions[categoryId]) {
          newOptions[categoryId] = [option];
        } else {
          const existingIndex = newOptions[categoryId].findIndex(
            (opt) => opt.$id === option.$id
          );

          if (existingIndex >= 0) {
            // Remove if already selected
            newOptions[categoryId] = newOptions[categoryId].filter(
              (_, i) => i !== existingIndex
            );
            if (newOptions[categoryId].length === 0) {
              delete newOptions[categoryId];
            }
          } else {
            // Check if adding this option would exceed maxAmount
            if (selectedItem) {
              const category = selectedItem.menuOptionCategory.find(
                (cat) => cat.$id === categoryId
              );
              if (
                category &&
                newOptions[categoryId].length >= category.maxAmount
              ) {
                // Don't add if it would exceed maxAmount
                return prev;
              }
            }

            // Add if not selected and not exceeding maxAmount
            newOptions[categoryId] = [...newOptions[categoryId], option];
          }
        }
      }

      return newOptions;
    });
  };

  const isOptionSelected = (categoryId: string, optionId: string): boolean => {
    return !!selectedOptions[categoryId]?.some(
      (option) => option.$id === optionId
    );
  };

  const calculateTotalPrice = (): number => {
    if (!selectedItem) return 0;

    let total = selectedItem.price * quantity;

    // Add option prices
    Object.values(selectedOptions).forEach((options) => {
      options.forEach((option) => {
        total += option.price * quantity;
      });
    });

    return total;
  };

  const isRequiredOptionsMissing = (): boolean => {
    if (!selectedItem) return true;

    return selectedItem.menuOptionCategory.some((category) => {
      if (category.isRequired) {
        return (
          !selectedOptions[category.$id] ||
          selectedOptions[category.$id].length === 0
        );
      }
      return false;
    });
  };

  const getSelectedCount = (categoryId: string): number => {
    return selectedOptions[categoryId]?.length || 0;
  };

  const isMaxReached = (categoryId: string): boolean => {
    if (!selectedItem) return false;

    const category = selectedItem.menuOptionCategory.find(
      (cat) => cat.$id === categoryId
    );

    if (!category) return false;

    const selectedCount = getSelectedCount(categoryId);
    return selectedCount >= category.maxAmount;
  };

  const handleSubmit = () => {
    if (!selectedItem) return;

    const cartItem = createCartItemFromMenuItem(
      selectedItem,
      selectedOptions,
      note
    );
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
                  {selectedItem.image && !imageError ? (
                    <Image
                      src={selectedItem.image}
                      alt={
                        typeof selectedItem.name === "string"
                          ? selectedItem.name
                          : "Menu item"
                      }
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-yellow-50 border-2 border-yellow-100 flex items-center justify-center p-4 text-center">
                      <span className="text-yellow-800 font-bold text-xl whitespace-pre-line">
                        {formatTextForPlaceholder(selectedItem.name, 2, 4)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                  <p className="text-muted-foreground mt-1">
                    {selectedItem.description}
                  </p>
                  <div className="flex flex-col items-start">
                    {!selectedItem.discountPrice ? (
                      <p className="font-bold">{formatPrice(selectedItem.price)}</p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(selectedItem.price)}
                        </p>
                        <p className="font-bold">{formatPrice(selectedItem.discountPrice)}</p>
                      </>
                    )}
                  </div>
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
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.type === "checkbox" && (
                        <p className="text-xs text-muted-foreground">
                          Select up to {category.maxAmount}{" "}
                          {category.maxAmount === 1 ? "option" : "options"}
                          {category.isRequired && " (Required)"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {category.type === "checkbox" && (
                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {getSelectedCount(category.$id)}/{category.maxAmount}
                          {" Selected"}
                        </Badge>
                      )}
                      {category.isRequired &&
                        (selectedOptions[category.$id]?.length > 0 ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex gap-1">
                            <Check className="h-3 w-3" />
                            <span>Selected</span>
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 flex gap-1 hover:bg-red-100">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Required</span>
                          </Badge>
                        ))}
                    </div>
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
                            className="flex items-center justify-between py-2 px-3 border rounded-md cursor-pointer"
                            onClick={() => {
                              const value = option.$id;
                              const foundOption = category.menuOptionId.find(
                                (opt) => opt.$id === value
                              );
                              if (foundOption) {
                                handleOptionChange(
                                  category.$id,
                                  foundOption,
                                  true
                                );
                              }
                            }}
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
                      {category.menuOptionId.map((option) => {
                        const maxReached = isMaxReached(category.$id);
                        const isSelected = isOptionSelected(
                          category.$id,
                          option.$id
                        );

                        return (
                          <div
                            key={option.$id}
                            className={`flex items-center justify-between py-2 px-3 border rounded-md ${!maxReached || isSelected
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                              }`}
                            onClick={() => {
                              if (!maxReached || isSelected) {
                                handleOptionChange(category.$id, option, false);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={option.$id}
                                checked={isOptionSelected(
                                  category.$id,
                                  option.$id
                                )}
                                onCheckedChange={() => {
                                  if (!maxReached || isSelected) {
                                    handleOptionChange(
                                      category.$id,
                                      option,
                                      false
                                    );
                                  }
                                }}
                                disabled={maxReached && !isSelected}
                              />
                              <Label
                                htmlFor={option.$id}
                                className={`${maxReached && !isSelected
                                  ? "text-gray-400"
                                  : "cursor-pointer"
                                  }`}
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
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div>
                <h3 className="font-semibold mb-3">Order Notes</h3>
                <Textarea
                  placeholder="Add any special requests, allergies, dietary restrictions, etc."
                  className="resize-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
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

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import type { MenuItem } from "@/types/menuItem";
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
import {
  categoryModifierMapping,
  modifiers,
} from "@/app/(online-order)/store/modifier";
import { formatPrice } from "@/lib/utils";

interface ItemDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: MenuItem | null;
  editingCartItem: any | null;
  onAddToCart: (item: any) => void;
  onUpdateCartItem: (item: any) => void;
}

export function ItemDrawer({
  isOpen,
  onOpenChange,
  selectedItem,
  editingCartItem,
  onAddToCart,
  onUpdateCartItem,
}: ItemDrawerProps) {
  const [quantity, setQuantity] = useState(1);

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
      }
    }
  }, [isOpen, editingCartItem]);

  const [selectedModifiers, setSelectedModifiers] = useState<{
    [key: string]: {
      id: number;
      name: string;
      price: number;
    };
  }>(editingCartItem?.selectedModifiers || {});

  const [selectedToppings, setSelectedToppings] = useState<
    {
      id: number;
      name: string;
      price: number;
    }[]
  >(editingCartItem?.extraToppings || []);

  const handleModifierChange = (
    category: string,
    modifier: { id: number; name: string; price: number }
  ) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [category]: modifier,
    }));
  };

  const handleToppingToggle = (topping: {
    id: number;
    name: string;
    price: number;
  }) => {
    setSelectedToppings((prev) => {
      const exists = prev.find((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, topping];
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedItem) return 0;
    const basePrice = selectedItem.price;
    const modifierPrice = Object.values(selectedModifiers).reduce(
      (sum, mod) => sum + mod.price,
      0
    );
    const toppingsPrice = selectedToppings.reduce(
      (sum, topping) => sum + topping.price,
      0
    );
    return (basePrice + modifierPrice + toppingsPrice) * quantity;
  };

  const handleSubmit = () => {
    if (!selectedItem) return;

    const item = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: quantity,
      category: selectedItem.category,
      selectedModifiers,
      extraToppings: selectedToppings,
    };

    if (editingCartItem) {
      onUpdateCartItem(item);
    } else {
      onAddToCart(item);
    }
  };

  // Reset modifiers and toppings when selectedItem changes (not when editing)
  useEffect(() => {
    if (!editingCartItem && selectedItem) {
      // Set default modifiers based on category
      const defaultModifiers: { [key: string]: any } = {};
      const availableModifiers =
        categoryModifierMapping[
          selectedItem.category as keyof typeof categoryModifierMapping
        ] || [];

      availableModifiers.forEach((modifierCategory) => {
        if (modifierCategory !== "Extra Toppings") {
          const defaultOption = modifiers[
            modifierCategory as keyof typeof modifiers
          ].find((mod) => mod.default);
          if (defaultOption) {
            defaultModifiers[modifierCategory] = {
              id: defaultOption.id,
              name: defaultOption.name,
              price: defaultOption.price,
            };
          }
        }
      });

      setSelectedModifiers(defaultModifiers);
      setSelectedToppings([]);
    }
  }, [selectedItem, editingCartItem]);

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
                    src="/placeholder/placeholder.svg?height=448&width=448"
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

              {Object.entries(categoryModifierMapping).map(
                ([category, availableModifiers]) => {
                  if (
                    category === selectedItem.category &&
                    availableModifiers.length > 0
                  ) {
                    return (
                      <div key={category} className="space-y-4">
                        {availableModifiers.map((modifierCategory) => {
                          if (modifierCategory === "Extra Toppings") {
                            return (
                              <div key={modifierCategory}>
                                <h3 className="font-semibold mb-3">
                                  {modifierCategory}{" "}
                                  <span className="text-sm font-normal text-muted-foreground">
                                    (Max 3)
                                  </span>
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                  {modifiers[modifierCategory].map(
                                    (modifier) => (
                                      <Label
                                        key={modifier.id}
                                        className="flex items-center space-x-3 space-y-0 border rounded-lg p-3"
                                      >
                                        <Checkbox
                                          checked={selectedToppings.some(
                                            (t) => t.id === modifier.id
                                          )}
                                          onCheckedChange={() =>
                                            handleToppingToggle(modifier)
                                          }
                                          disabled={
                                            selectedToppings.length >= 3 &&
                                            !selectedToppings.some(
                                              (t) => t.id === modifier.id
                                            )
                                          }
                                        />
                                        <div className="flex-1 flex justify-between items-center">
                                          <span>{modifier.name}</span>
                                          {modifier.price > 0 && (
                                            <span className="text-muted-foreground">
                                              +{formatPrice(modifier.price)}
                                            </span>
                                          )}
                                        </div>
                                      </Label>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={modifierCategory}>
                              <h3 className="font-semibold mb-3">
                                {modifierCategory}
                              </h3>
                              <RadioGroup
                                value={String(
                                  selectedModifiers[modifierCategory]?.id
                                )}
                                onValueChange={(value) => {
                                  const modifier = modifiers[
                                    modifierCategory as keyof typeof modifiers
                                  ].find((mod) => String(mod.id) === value);
                                  if (modifier) {
                                    handleModifierChange(
                                      modifierCategory,
                                      modifier
                                    );
                                  }
                                }}
                              >
                                <div className="grid grid-cols-1 gap-2">
                                  {modifiers[
                                    modifierCategory as keyof typeof modifiers
                                  ].map((modifier) => (
                                    <Label
                                      key={modifier.id}
                                      className="flex items-center space-x-3 space-y-0 border rounded-lg p-3"
                                    >
                                      <RadioGroupItem
                                        value={String(modifier.id)}
                                      />
                                      <div className="flex-1 flex justify-between items-center">
                                        <span>{modifier.name}</span>
                                        {modifier.price > 0 && (
                                          <span className="text-muted-foreground">
                                            +{formatPrice(modifier.price)}
                                          </span>
                                        )}
                                      </div>
                                    </Label>
                                  ))}
                                </div>
                              </RadioGroup>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }
              )}
            </div>
          )}
        </div>

        <DrawerFooter className="px-4 py-4 border-t">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 bg-black hover:bg-black/90"
            disabled={!selectedItem}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">
                {editingCartItem ? "Update Cart" : "Add to Cart"}
              </span>
              <span className="font-medium">
                {formatPrice(calculateTotalPrice())}
              </span>
            </div>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

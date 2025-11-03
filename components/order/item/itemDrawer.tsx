"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // dialog info
  const [infoOpen, setInfoOpen] = useState(false);
  const [pendingInfo, setPendingInfo] = useState<{
    title: string;
    description: string;
    categoryId: string;
    option: MenuOption;
    isRadio: boolean;
  } | null>(null);

  const openInfo = (
    title: string,
    description: string,
    categoryId: string,
    option: MenuOption,
    isRadio: boolean
  ) => {
    setPendingInfo({ title, description, categoryId, option, isRadio });
    setInfoOpen(true);
  };

  // 👇 ini buat tinggi (80vh ↔ 100vh)
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
      setIsExpanded(false); // balik ke awal
    }
  }, [isOpen, editingCartItem]);

  // Initialize selected options when item changes or when editing
  useEffect(() => {
    if (selectedItem) {
      if (editingCartItem) {
        const options: { [categoryId: string]: MenuOption[] } = {};

        Object.entries(editingCartItem.selectedOptions).forEach(
          ([categoryId, cartOptions]) => {
            const category = selectedItem.menuOptionCategory.find(
              (cat) => cat.$id === categoryId
            );
            if (category) {
              options[categoryId] = cartOptions.map((cartOption) => {
                const originalOption = category.menuOptionId.find(
                  (opt) => opt.$id === cartOption.$id
                );
                return (
                  originalOption || ({
                    $id: cartOption.$id,
                    name: cartOption.name,
                    price: cartOption.price,
                    discountPrice: cartOption.discountPrice,
                    description: null,
                    isInStock: true,
                    index: null,
                    outstock: null,
                  } as MenuOption)
                );
              });
            }
          }
        );

        setSelectedOptions(options);
      } else {
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
        newOptions[categoryId] = [option];
      } else {
        if (!newOptions[categoryId]) {
          newOptions[categoryId] = [option];
        } else {
          const existingIndex = newOptions[categoryId].findIndex(
            (opt) => opt.$id === option.$id
          );

          if (existingIndex >= 0) {
            newOptions[categoryId] = newOptions[categoryId].filter(
              (_, i) => i !== existingIndex
            );
            if (newOptions[categoryId].length === 0) {
              delete newOptions[categoryId];
            }
          } else {
            if (selectedItem) {
              const category = selectedItem.menuOptionCategory.find(
                (cat) => cat.$id === categoryId
              );
              if (category) {
                if (category.maxAmount === 1) {
                  newOptions[categoryId] = [option];
                } else if (newOptions[categoryId].length >= category.maxAmount) {
                  return prev;
                } else {
                  newOptions[categoryId] = [...newOptions[categoryId], option];
                }
              } else {
                newOptions[categoryId] = [...newOptions[categoryId], option];
              }
            } else {
              newOptions[categoryId] = [...newOptions[categoryId], option];
            }
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

    const baseItemPrice = selectedItem.discountPrice ?? selectedItem.price;
    let total = baseItemPrice * quantity;

    Object.values(selectedOptions).forEach((options) => {
      options.forEach((option) => {
        const optionPrice = option.discountPrice ?? option.price;
        total += optionPrice * quantity;
      });
    });

    return total;
  };

  const isRequiredOptionsMissing = (): boolean => {
    if (!selectedItem) return true;

    return selectedItem.menuOptionCategory.some((category) => {
      const minAmount = category.minAmount || 0;
      const selectedCount = selectedOptions[category.$id]?.length || 0;
      return minAmount > 0 && selectedCount < minAmount;
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

  // 👇 inti permintaanmu: kalau udah nyentuh atas → langsung kecil
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const top = el.scrollTop;

    // scroll ke bawah dikit → perbesar
    if (!isExpanded && top > 10) {
      setIsExpanded(true);
      return;
    }

    // scroll balik ke atas → langsung kecil lagi (tanpa delay)
    if (isExpanded && top === 0) {
      setIsExpanded(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      {/* className kamu tetap */}
      <DrawerContent
        className="max-h-[80vh] p-0 max-w-md mx-auto rounded-t-[20px]"
        // cuma gaya transisinya aja
        style={{
          maxHeight: isExpanded ? "100vh" : "80vh",
          transition: "max-height 0.25s ease-in-out",
        }}
      >
        <div
          className="h-full overflow-y-auto"
          ref={scrollRef}
          onScroll={handleScroll}
        >
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
                      onDragStart={(event) => event.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
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
                      <p className="font-bold">
                        {formatPrice(selectedItem.price)}
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(selectedItem.price)}
                        </p>
                        <p className="font-bold">
                          {formatPrice(selectedItem.discountPrice)}
                        </p>
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
              {selectedItem.menuOptionCategory.map((category) => {
                const minAmount = category.minAmount || 0;
                const maxAmount = category.maxAmount;
                const selectedCount = getSelectedCount(category.$id);
                const isRequirementMet = selectedCount >= minAmount;
                let requirementText = "";

                if (minAmount > 0) {
                  requirementText = `(Pilih ${minAmount})`;
                }

                if (maxAmount > 1 && maxAmount != category.menuOptionId.length) {
                  requirementText = `(Pilih ${minAmount}, Maks. ${maxAmount})`;
                }

                return (
                  <div key={category.$id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {category.name}{" "}
                          {requirementText && (
                            <span className="text-sm font-normal text-muted-foreground">
                              {requirementText}
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {category.type === "checkbox" && (
                          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                            {selectedCount}/{maxAmount}
                            {" Terpilih"}
                          </Badge>
                        )}
                        {minAmount > 0 &&
                          (isRequirementMet ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex gap-1">
                              <Check className="h-3 w-3" />
                              <span>Terpilih</span>
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 flex gap-1 hover:bg-red-100">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Wajib</span>
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
                            const isOutOfStock = (() => {
                              if (!option.outstock) return false;
                              const outStockDate = new Date(option.outstock);
                              const currentDate = new Date();
                              return outStockDate > currentDate;
                            })();

                            if (!isOutOfStock) {
                              handleOptionChange(category.$id, option, true);
                            }
                          }
                        }}
                      >
                        <div className="space-y-2">
                          {category.menuOptionId.map((option) => {
                            const isOutOfStock = (() => {
                              if (!option.outstock) return false;
                              const outStockDate = new Date(option.outstock);
                              const currentDate = new Date();
                              return outStockDate > currentDate;
                            })();

                            return (
                              <div
                                key={option.$id}
                                className={`flex items-center justify-between py-2 px-3 border rounded-md transition-colors ${!isOutOfStock
                                  ? "cursor-pointer hover:bg-accent"
                                  : "cursor-not-allowed opacity-60"
                                  }`}
                                onClick={() => {
                                  if (isOutOfStock) return;

                                  const foundOption =
                                    category.menuOptionId.find(
                                      (opt) => opt.$id === option.$id
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
                                    disabled={isOutOfStock}
                                  />
                                  <Label
                                    htmlFor={option.$id}
                                    className={`${!isOutOfStock
                                      ? "cursor-pointer"
                                      : "cursor-not-allowed text-gray-400"
                                      }`}
                                  >
                                    {option.name}
                                    {isOutOfStock && (
                                      <span className="ml-2 text-xs text-red-500">
                                        (Out of Stock)
                                      </span>
                                    )}
                                  </Label>
                                  {option.description && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-10 shrink-0"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openInfo(
                                          `${option.name}`,
                                          option.description as string,
                                          category.$id,
                                          option,
                                          false
                                        );
                                      }}
                                      aria-label="Lihat deskripsi opsi"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  )}
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
                      </RadioGroup>
                    ) : (
                      <div className="space-y-2">
                        {category.menuOptionId.map((option) => {
                          const maxReached = isMaxReached(category.$id);
                          const isSelected = isOptionSelected(
                            category.$id,
                            option.$id
                          );
                          const isOutOfStock = (() => {
                            if (!option.outstock) return false;
                            const outStockDate = new Date(option.outstock);
                            const currentDate = new Date();
                            return outStockDate > currentDate;
                          })();

                          const canClick =
                            !isOutOfStock &&
                            (category.maxAmount === 1 ||
                              !maxReached ||
                              isSelected);

                          return (
                            <div
                              key={option.$id}
                              className={`flex items-center justify-between py-2 px-3 border rounded-md transition-colors ${(!maxReached || isSelected) && !isOutOfStock
                                ? "cursor-pointer hover:bg-accent"
                                : "cursor-not-allowed opacity-60"
                                }`}
                              onClick={() => {
                                if (
                                  (!maxReached || isSelected) &&
                                  !isOutOfStock
                                ) {
                                  handleOptionChange(
                                    category.$id,
                                    option,
                                    false
                                  );
                                }
                              }}
                            >
                              <Label
                                htmlFor={option.$id}
                                className={`flex items-center gap-3 flex-1 ${(!maxReached || isSelected) && !isOutOfStock
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed"
                                  }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  id={option.$id}
                                  checked={isSelected}
                                  onCheckedChange={() => {
                                    if (
                                      (!maxReached || isSelected) &&
                                      !isOutOfStock
                                    ) {
                                      handleOptionChange(
                                        category.$id,
                                        option,
                                        false
                                      );
                                    }
                                  }}
                                  disabled={!canClick}
                                />
                                <span className={`${(maxReached && !isSelected) || isOutOfStock
                                  ? "text-gray-400"
                                  : ""
                                  }`}>
                                  {option.name}
                                  {isOutOfStock && <span className="ml-2 text-xs text-red-500">(Out of Stock)</span>}
                                </span>
                                {option.description && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-8 shrink-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      openInfo(
                                        `${option.name}`,
                                        option.description as string,
                                        category.$id,
                                        option,
                                        false
                                      );
                                    }}
                                    aria-label="Lihat deskripsi opsi"
                                  >
                                    <Info className="h-4 w-4" />
                                  </Button>
                                )}
                              </Label>

                              {option.price > 0 && (
                                <span className="text-sm font-medium pl-2">
                                  +{formatPrice(option.price)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
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

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-sm [&>button]:hidden">
          <DialogHeader className="p-6 pb-4">
            <div className="flex flex-col items-center text-center gap-2">
              <DialogTitle>{pendingInfo?.title}</DialogTitle>
              <DialogDescription className="whitespace-pre-wrap mt-2">
                {pendingInfo?.description}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setInfoOpen(false)}
              aria-label="Kembali"
            >
              Back
            </Button>

            {(() => {
              if (!pendingInfo) return null;

              const selected = selectedOptions[pendingInfo.categoryId] || [];
              const isAlreadySelected = selected.some(
                (o) => o.$id === pendingInfo.option.$id
              );
              if (isAlreadySelected) return null;

              const isOut =
                !!pendingInfo.option.outstock &&
                new Date(pendingInfo.option.outstock) > new Date();

              let disableSelect = isOut;
              if (!pendingInfo.isRadio) {
                const category = selectedItem?.menuOptionCategory.find(
                  (c) => c.$id === pendingInfo.categoryId
                );
              }

              return (
                <Button
                  type="button"
                  aria-label="Pilih opsi ini"
                  onClick={() => {
                    const { categoryId, option, isRadio } = pendingInfo;
                    handleOptionChange(categoryId, option, isRadio);
                    setInfoOpen(false);
                  }}
                  disabled={disableSelect}
                >
                  Select
                </Button>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
}

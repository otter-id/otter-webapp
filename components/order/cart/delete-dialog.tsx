import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CartItem } from "@/types/cart";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: CartItem | null;
  onConfirm: (item: CartItem) => void;
}

export function DeleteConfirmation({ isOpen, onOpenChange, item, onConfirm }: DeleteConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[320px] rounded-lg bg-gradient-to-b from-red-50 to-white">
        <AlertDialogHeader className="space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">Remove Item</AlertDialogTitle>
          <AlertDialogDescription className="text-center">Are you sure you want to remove this item from your cart?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
          <AlertDialogAction
            onClick={() => {
              if (item) {
                onConfirm(item);
              }
              onOpenChange(false);
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white rounded-full"
          >
            Remove
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full border-red-100 text-gray-600 hover:bg-red-50 hover:text-gray-900"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

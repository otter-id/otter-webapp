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

interface StartOverDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function StartOverDialog({ isOpen, onOpenChange, onConfirm }: StartOverDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[320px] rounded-lg bg-gradient-to-b from-red-50 to-white">
        <AlertDialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">Start Over</AlertDialogTitle>
          <AlertDialogDescription className="text-center">Are you sure you want to start over?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="w-full rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            Start Over
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

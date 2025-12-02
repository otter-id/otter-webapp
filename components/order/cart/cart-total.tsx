import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { CartTotals as CartTotalsType } from "@/types/cart";
import { formatPrice } from "@/utils/client";

interface CartTotalsProps {
  totals: CartTotalsType;
  isFeesExpanded: boolean;
  onFeesExpandedChange: (expanded: boolean) => void;
}

export function CartTotals({ totals, isFeesExpanded, onFeesExpandedChange }: CartTotalsProps) {
  return (
    <div className="space-y-4">
      <Collapsible open={isFeesExpanded} onOpenChange={onFeesExpandedChange}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(totals.subtotal)}</span>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto p-0 hover:bg-transparent">
              <span className="text-muted-foreground">Taxes & Fees</span>
              <div className="flex items-center gap-2">
                <span>{formatPrice(totals.tax + totals.serviceFee)}</span>
                {isFeesExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="flex justify-between pl-4">
              <span className="text-sm text-muted-foreground">Tax ({totals.taxPercentage}%)</span>
              <span className="text-sm">{formatPrice(totals.tax)}</span>
            </div>
            <div className="flex justify-between pl-4">
              <span className="text-sm text-muted-foreground">Service Fee ({totals.servicePercentage}%)</span>
              <span className="text-sm">{formatPrice(totals.serviceFee)}</span>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
      <Separator />
      <div className="flex justify-between font-medium text-lg">
        <span>Total Due</span>
        <span>{formatPrice(totals.total)}</span>
      </div>
    </div>
  );
}

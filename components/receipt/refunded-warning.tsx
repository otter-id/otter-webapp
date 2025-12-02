import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function RefundedWarning() {
  return (
    <Card className="mb-4 border-2 border-red-500">
      <CardHeader>
        <span className="flex items-center justify-center text-red-500">
          <AlertCircle className="mr-2 size-8" />
          <CardTitle className="text-center font-bold">REFUNDED ORDER</CardTitle>
        </span>
      </CardHeader>
      <CardContent className="text-center">This order has been refunded.</CardContent>
    </Card>
  );
}

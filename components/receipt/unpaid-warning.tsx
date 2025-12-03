import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function UnpaidWarning() {
  return (
    <Card className="mb-4 border-2 border-red-500">
      <CardHeader>
        <span className="flex items-center justify-center text-red-500">
          <AlertCircle className="mr-2 size-8" />
          <CardTitle className="text-center font-bold">UNPAID ORDER</CardTitle>
        </span>
      </CardHeader>
      <CardContent className="text-center">Your have not paid for this order, please pay at cashier.</CardContent>
    </Card>
  );
}

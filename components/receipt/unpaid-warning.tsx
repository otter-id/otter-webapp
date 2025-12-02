import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function UnpaidWarning() {
  return (
    <Card className="mb-4 border-red-500 border-2">
      <CardHeader>
        <span className="flex items-center justify-center text-red-500">
          <AlertCircle className="size-8  mr-2" />
          <CardTitle className="text-center font-bold ">UNPAID ORDER</CardTitle>
        </span>
      </CardHeader>
      <CardContent className="text-center">Your have not paid for this order, please pay at cashier.</CardContent>
    </Card>
  );
}

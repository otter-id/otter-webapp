import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export function RefundedWarning() {
    return (
        <Card className="mb-4 border-red-500 border-2">
            <CardHeader>
                <span className="flex items-center justify-center text-red-500">
                    <AlertCircle className="size-8  mr-2" />
                    <CardTitle className="text-center font-bold ">REFUNDED ORDER</CardTitle>
                </span>
            </CardHeader>
            <CardContent className="text-center">
                This order has been refunded.
            </CardContent>
        </Card>
    );
}

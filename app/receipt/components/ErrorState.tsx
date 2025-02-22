import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-4 px-4 max-w-md mx-auto flex items-center justify-center">
      <Card className="w-full border-pink-100">
        <CardContent className="py-8 text-center space-y-4">
          <div className="text-pink-600 mb-4">
            <Info className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {error || "Receipt not found"}
          </h2>
          <p className="text-gray-500">
            Please check the order ID and try again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

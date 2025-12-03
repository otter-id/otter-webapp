import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-gradient-to-b from-amber-50 to-white px-4 py-4">
      <Card className="w-full border-amber-100">
        <CardContent className="space-y-4 py-8 text-center">
          <div className="mb-4 text-amber-600">
            <Info className="mx-auto h-12 w-12" />
          </div>
          <h2 className="font-semibold text-gray-900 text-xl">Hmm, something is not right</h2>
          <p className="text-gray-500">Please check the order ID and try again.</p>
        </CardContent>
      </Card>
    </div>
  );
}

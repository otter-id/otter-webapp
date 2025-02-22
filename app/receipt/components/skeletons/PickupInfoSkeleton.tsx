import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { skeletonClass } from "../../utils/animations";

export function PickupInfoSkeleton() {
  return (
    <Card className="rounded-xl border-yellow-100">
      <CardHeader>
        <div className={`${skeletonClass} h-6 w-1/4 rounded-md`} />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className={`${skeletonClass} h-5 w-5 rounded-md`} />
            <div className="space-y-2 flex-1">
              <div className={`${skeletonClass} h-5 w-1/3 rounded-md`} />
              <div className={`${skeletonClass} h-4 w-2/3 rounded-md`} />
            </div>
          </div>
        ))}
        <div className={`${skeletonClass} h-10 w-full rounded-md mt-4`} />
      </CardContent>
    </Card>
  );
}

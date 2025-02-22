import { Card, CardContent } from "@/components/ui/card";
import { skeletonClass } from "../../utils/animations";

export function PointsCardSkeleton() {
  return (
    <Card className="rounded-xl border-yellow-100 bg-gradient-to-br from-yellow-100 to-amber-100">
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className={`${skeletonClass} h-6 w-32 rounded-md`} />
            <div className={`${skeletonClass} h-4 w-40 rounded-md`} />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`${skeletonClass} h-8 w-8 rounded-md`} />
            <div className={`${skeletonClass} h-8 w-8 rounded-md`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

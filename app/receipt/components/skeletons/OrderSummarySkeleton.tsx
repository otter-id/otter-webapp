import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { skeletonClass } from "../../utils/animations";

export function OrderSummarySkeleton() {
  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-2 py-4 bg-yellow-100">
        <div className="flex justify-between">
          <div className={`${skeletonClass} h-5 w-1/4 rounded-md`} />
          <div className={`${skeletonClass} h-5 w-1/4 rounded-md`} />
        </div>
        <div className="flex justify-between">
          <div className={`${skeletonClass} h-5 w-1/3 rounded-md`} />
          <div className={`${skeletonClass} h-5 w-1/4 rounded-md`} />
        </div>
        <Separator className="bg-yellow-100" />
        <div className="flex justify-between">
          <div className={`${skeletonClass} h-6 w-1/4 rounded-md`} />
          <div className={`${skeletonClass} h-6 w-1/3 rounded-md`} />
        </div>
        <div className={`${skeletonClass} h-10 w-full rounded-md mt-4`} />
      </CardContent>
    </Card>
  );
}

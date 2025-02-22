import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { skeletonClass } from "../../utils/animations";

export function ReceiptHeaderSkeleton() {
  return (
    <Card className="rounded-xl border-yellow-100">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className={`${skeletonClass} w-[60px] h-[60px] rounded-full`} />
        <div className="space-y-2 flex-1">
          <div className={`${skeletonClass} h-6 w-3/4 rounded-md`} />
          <div className={`${skeletonClass} h-4 w-1/2 rounded-md`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4 space-y-2">
          <div className={`${skeletonClass} h-12 w-1/3 mx-auto rounded-md`} />
          <div className={`${skeletonClass} h-8 w-1/2 mx-auto rounded-md`} />
          <div className={`${skeletonClass} h-4 w-1/4 mx-auto rounded-md`} />
        </div>
      </CardContent>
    </Card>
  );
}

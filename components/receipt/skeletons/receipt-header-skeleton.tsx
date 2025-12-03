import { skeletonClass } from "@/app/receipt/utils/animations";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ReceiptHeaderSkeleton() {
  return (
    <Card className="rounded-xl border-yellow-100">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className={`${skeletonClass} h-[60px] w-[60px] rounded-full`} />
        <div className="flex-1 space-y-2">
          <div className={`${skeletonClass} h-6 w-3/4 rounded-md`} />
          <div className={`${skeletonClass} h-4 w-1/2 rounded-md`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 py-4 text-center">
          <div className={`${skeletonClass} mx-auto h-12 w-1/3 rounded-md`} />
          <div className={`${skeletonClass} mx-auto h-8 w-1/2 rounded-md`} />
          <div className={`${skeletonClass} mx-auto h-8 w-1/4 rounded-md`} />
          <div className={`${skeletonClass} mx-auto h-20 w-1/1 rounded-md`} />
        </div>
      </CardContent>
    </Card>
  );
}

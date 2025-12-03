import { skeletonClass } from "@/app/receipt/utils/animations";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function OrderDetailsSkeleton() {
  return (
    <Card className="rounded-xl border-yellow-100">
      <CardHeader>
        <div className={`${skeletonClass} h-6 w-1/3 rounded-md`} />
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="flex space-x-4">
              <div className={`${skeletonClass} h-20 w-24 flex-shrink-0 rounded-md`} />
              <div className="flex-grow space-y-2">
                <div className="flex items-start justify-between">
                  <div className={`${skeletonClass} h-5 w-2/3 rounded-md`} />
                  <div className={`${skeletonClass} h-5 w-1/4 rounded-md`} />
                </div>
                <div className={`${skeletonClass} h-4 w-1/4 rounded-md`} />
                <div className="space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex justify-between">
                      <div className={`${skeletonClass} h-4 w-1/2 rounded-md`} />
                      <div className={`${skeletonClass} h-4 w-1/4 rounded-md`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {i < 3 && <Separator className="mt-3 bg-yellow-100" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

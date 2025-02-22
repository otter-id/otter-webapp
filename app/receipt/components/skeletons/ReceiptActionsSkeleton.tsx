import { skeletonClass } from "../../utils/animations";

export function ReceiptActionsSkeleton() {
  return (
    <div className="flex gap-2">
      <div className={`${skeletonClass} h-10 flex-1 rounded-md`} />
      <div className={`${skeletonClass} h-10 flex-1 rounded-md`} />
    </div>
  );
}

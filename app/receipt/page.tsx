"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ErrorState } from "@/components/receipt/error-state";
import { Footer } from "@/components/receipt/footer";
import { OrderDetails } from "@/components/receipt/order-details";
import { OrderSummary } from "@/components/receipt/order-summary";
import { PickupInfo } from "@/components/receipt/pickup-info";
import { PointsCard } from "@/components/receipt/points-card";
import { ReceiptActions } from "@/components/receipt/receipt-actions";
import { ReceiptHeader } from "@/components/receipt/receipt-header";
import { RefundedWarning } from "@/components/receipt/refunded-warning";
import { RestaurantFeedback } from "@/components/receipt/restaurant-feedback";
import { OrderDetailsSkeleton } from "@/components/receipt/skeletons/order-details-skeleton";
import { OrderSummarySkeleton } from "@/components/receipt/skeletons/order-summary-skeleton";
import { PickupInfoSkeleton } from "@/components/receipt/skeletons/pickup-info-skeleton";
import { PointsCardSkeleton } from "@/components/receipt/skeletons/points-card-skeleton";
import { ReceiptActionsSkeleton } from "@/components/receipt/skeletons/receipt-actions-skeleton";
// Skeleton components
import { ReceiptHeaderSkeleton } from "@/components/receipt/skeletons/receipt-header-skeleton";
import { SplitBill } from "@/components/receipt/split-bill";
import { UnpaidWarning } from "@/components/receipt/unpaid-warning";
// Temporary data for development
import { fakeReceiptData } from "@/utils/client";
import { useReceiptData } from "./hooks/use-receipt-data";
import { useSplitBill } from "./hooks/use-split-bill";
import { containerVariants } from "./utils/animations";

const ReceiptContent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const storeId = searchParams.get("sid");
  const { receiptData, isLoading, error } = useReceiptData(orderId, storeId);
  const data = isLoading ? fakeReceiptData.data : receiptData?.data || fakeReceiptData.data;
  const splitBillState = useSplitBill(data);

  if (!isMounted) {
    return null;
  }

  // Show error if we have no order ID
  if (!orderId) {
    return <ErrorState error="Order ID is required" />;
  }

  if (error && !isLoading) {
    return <ErrorState error={error} />;
  }

  if (!isLoading && !data) {
    return <ErrorState error="Receipt not found" />;
  }

  // If split bill is active, show only the split bill UI
  if (splitBillState.splitBillStep > 0) {
    return (
      <div className="mx-auto min-h-screen max-w-md bg-gradient-to-b from-orange-50 to-white px-4 py-4">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {data.status === "UNPAID" && <UnpaidWarning />}
          <ReceiptHeader data={data} />
          <SplitBill data={data} onClose={splitBillState.handleCancelSplitBill} splitBillState={splitBillState} />
          <Footer />
        </motion.div>
      </div>
    );
  }

  // Otherwise show the main receipt content
  return (
    <div className="mx-auto min-h-screen max-w-md bg-gradient-to-b from-orange-50 to-white px-4 py-4">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {isLoading ? (
          <>
            <ReceiptHeaderSkeleton />
            <ReceiptActionsSkeleton />
            <PickupInfoSkeleton />
            <OrderDetailsSkeleton />
            <OrderSummarySkeleton />
            <PointsCardSkeleton />
            <Footer />
          </>
        ) : (
          <>
            {data.status === "UNPAID" && <UnpaidWarning />}
            {data.orderStatus === "REFUNDED" && <RefundedWarning />}
            <ReceiptHeader data={data} />
            <ReceiptActions data={data} orderId={orderId} />
            <RestaurantFeedback data={data} />
            <PickupInfo data={data} />
            <OrderDetails data={data} />
            <OrderSummary data={data} onSplitBill={splitBillState.handleSplitBill} />
            <PointsCard data={data} />
            <Footer />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default function Receipt() {
  return (
    <Suspense>
      <ReceiptContent />
    </Suspense>
  );
}

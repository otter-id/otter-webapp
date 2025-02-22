"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useReceiptData } from "./hooks/useReceiptData";
import { useSplitBill } from "./hooks/useSplitBill";
import { containerVariants } from "./utils/animations";
import { ErrorState } from "./components/ErrorState";
import { ReceiptHeader } from "./components/ReceiptHeader";
import { ReceiptActions } from "./components/ReceiptActions";
import { PickupInfo } from "./components/PickupInfo";
import { OrderDetails } from "./components/OrderDetails";
import { OrderSummary } from "./components/OrderSummary";
import { PointsCard } from "./components/PointsCard";
import { SplitBill } from "./components/SplitBill";
import { RestaurantFeedback } from "./components/RestaurantFeedback";
import { Footer } from "./components/Footer";

// Skeleton components
import { ReceiptHeaderSkeleton } from "./components/skeletons/ReceiptHeaderSkeleton";
import { ReceiptActionsSkeleton } from "./components/skeletons/ReceiptActionsSkeleton";
import { PickupInfoSkeleton } from "./components/skeletons/PickupInfoSkeleton";
import { OrderDetailsSkeleton } from "./components/skeletons/OrderDetailsSkeleton";
import { OrderSummarySkeleton } from "./components/skeletons/OrderSummarySkeleton";
import { PointsCardSkeleton } from "./components/skeletons/PointsCardSkeleton";

// Temporary data for development
import { fakeData } from "./data";

const ReceiptContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { receiptData, isLoading, error } = useReceiptData(orderId);
  const splitBillState = useSplitBill(fakeData.data);

  // Show error only if there's an error and we're not loading
  if (error && !isLoading) {
    return <ErrorState error={error} />;
  }

  // Show error if we have no data after loading is complete
  if (!isLoading && !receiptData) {
    return <ErrorState error="Receipt not found" />;
  }

  const { data } = fakeData;

  // const data = isLoading ? fakeData.data : receiptData!.data; // Replace with receiptData when API is ready

  // If split bill is active, show only the split bill UI
  if (splitBillState.splitBillStep > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 px-4 max-w-md mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <ReceiptHeader data={data} />
          <SplitBill
            data={data}
            onClose={splitBillState.handleCancelSplitBill}
            splitBillState={splitBillState}
          />
          <Footer />
        </motion.div>
      </div>
    );
  }

  // Otherwise show the main receipt content
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-4 px-4 max-w-md mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
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
            <ReceiptHeader data={data} />
            <ReceiptActions data={data} orderId={orderId || ""} />
            <RestaurantFeedback />
            <PickupInfo data={data} />
            <OrderDetails data={data} />
            <OrderSummary
              data={data}
              onSplitBill={splitBillState.handleSplitBill}
            />
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

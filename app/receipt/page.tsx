"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useReceiptData } from "./hooks/useReceiptData";
import { useSplitBill } from "./hooks/useSplitBill";
import { containerVariants } from "./utils/animations";
import { ErrorState } from "../../components/receipt/ErrorState";
import { ReceiptHeader } from "../../components/receipt/ReceiptHeader";
import { ReceiptActions } from "../../components/receipt/ReceiptActions";
import { PickupInfo } from "../../components/receipt/PickupInfo";
import { OrderDetails } from "../../components/receipt/OrderDetails";
import { OrderSummary } from "../../components/receipt/OrderSummary";
import { PointsCard } from "../../components/receipt/PointsCard";
import { SplitBill } from "../../components/receipt/SplitBill";
import { RestaurantFeedback } from "../../components/receipt/RestaurantFeedback";
import { Footer } from "../../components/receipt/Footer";

// Skeleton components
import { ReceiptHeaderSkeleton } from "../../components/receipt/skeletons/ReceiptHeaderSkeleton";
import { ReceiptActionsSkeleton } from "../../components/receipt/skeletons/ReceiptActionsSkeleton";
import { PickupInfoSkeleton } from "../../components/receipt/skeletons/PickupInfoSkeleton";
import { OrderDetailsSkeleton } from "../../components/receipt/skeletons/OrderDetailsSkeleton";
import { OrderSummarySkeleton } from "../../components/receipt/skeletons/OrderSummarySkeleton";
import { PointsCardSkeleton } from "../../components/receipt/skeletons/PointsCardSkeleton";

// Temporary data for development
import { fakeData } from "../../data/receipt-sample";

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

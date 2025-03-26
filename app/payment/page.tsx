"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { QrCode, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import PaymentForm from "@/components/payment/paymentForm";
import OtpVerification from "@/components/payment/otpVerification";
import OrderSummary from "@/components/payment/orderSummary";

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
}

interface CustomerData {
  name: string;
  phoneNumber: string;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    items: [],
    subtotal: 0,
    tax: 0,
    serviceFee: 0,
    total: 0,
  });

  // Customer data state
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phoneNumber: "",
  });

  // Mock function to fetch order data
  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual API call
        setTimeout(() => {
          // Sample data - this would come from your API
          setOrderData({
            items: [
              { id: "1", name: "Chicken Rice Bowl", price: 35000, quantity: 1 },
              { id: "2", name: "Iced Tea", price: 15000, quantity: 2 },
            ],
            subtotal: 65000,
            tax: 7150,
            serviceFee: 3250,
            total: 75400,
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setIsLoading(false);
        toast.error("Failed to load order data");
      }
    };

    fetchOrderData();
  }, []);

  const handleCustomerDataSubmit = (data: CustomerData) => {
    setCustomerData(data);
    // Simulate sending OTP
    toast.success("OTP sent to your phone number", {
      description: "Please enter the verification code",
    });
    setStep(2);
  };

  const handleOtpVerification = () => {
    setIsLoading(true);
    // Simulate verification process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Phone number verified successfully");
      setStep(3);
    }, 1500);
  };

  const handlePayment = () => {
    setIsLoading(true);
    // Simulate payment process
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Payment successful!");
      router.push("/receipt");
    }, 2000);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="flex items-center p-0 h-auto"
          onClick={handleBack}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </Button>
        <h1 className="text-2xl font-bold mt-4">Checkout</h1>
        <p className="text-muted-foreground">
          {step === 1
            ? "Enter your details"
            : step === 2
            ? "Verify your phone number"
            : "Complete your payment"}
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mb-6">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            {step > 1 ? <Check className="h-5 w-5" /> : 1}
          </div>
          <span className="text-xs mt-1">Details</span>
        </div>
        <div className="flex-1 flex items-center px-2">
          <div
            className={`h-1 w-full ${
              step > 1 ? "bg-yellow-400" : "bg-gray-200"
            }`}
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            {step > 2 ? <Check className="h-5 w-5" /> : 2}
          </div>
          <span className="text-xs mt-1">Verify</span>
        </div>
        <div className="flex-1 flex items-center px-2">
          <div
            className={`h-1 w-full ${
              step > 2 ? "bg-yellow-400" : "bg-gray-200"
            }`}
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            3
          </div>
          <span className="text-xs mt-1">Pay</span>
        </div>
      </div>

      {/* Order Summary */}
      <MotionCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl mb-6"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderSummary data={orderData} isLoading={isLoading} />
        </CardContent>
      </MotionCard>

      {/* Step Content */}
      <MotionCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl"
      >
        <CardContent className="p-6">
          {step === 1 && (
            <PaymentForm
              onSubmit={handleCustomerDataSubmit}
              isLoading={isLoading}
              initialData={customerData}
            />
          )}

          {step === 2 && (
            <OtpVerification
              onVerify={handleOtpVerification}
              phoneNumber={customerData.phoneNumber}
              isLoading={isLoading}
              onResendOtp={() => {
                toast.success("New OTP sent to your phone number");
              }}
            />
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="border rounded-md p-4 bg-gray-50 flex items-center space-x-3">
                  <QrCode className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-medium">QRIS</p>
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code with your mobile banking app
                    </p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                <div className="bg-white p-3 rounded-md border mb-2">
                  {/* This would be your actual QR code */}
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with your mobile banking app to complete
                  payment
                </p>
                <div className="flex items-center mt-2 text-yellow-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Expires in 15:00</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-black hover:bg-black/90"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "I have completed payment"}
              </Button>
            </div>
          )}
        </CardContent>
      </MotionCard>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" className="flex items-center p-0 h-auto">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold mt-4">Loading...</h1>
            <p className="text-muted-foreground">
              Please wait while we load your order details
            </p>
          </div>
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-40">
                <Clock className="h-8 w-8 animate-spin text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}

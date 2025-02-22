"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cardVariants } from "../utils/animations";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const MotionCard = motion(Card);
const MotionThumbsUp = motion(ThumbsUp);
const MotionThumbsDown = motion(ThumbsDown);

export function RestaurantFeedback() {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [improvementFeedback, setImprovementFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedback = (type: "like" | "dislike") => {
    setFeedback(type);
    setIsSubmitted(type === "like");
    // Here you would typically send this to your backend
    console.log(`User gave ${type} feedback`);
  };

  const handleSubmitImprovement = () => {
    // Here you would typically send this to your backend
    console.log("Improvement feedback:", improvementFeedback);
    setIsSubmitted(true);
  };

  return (
    <MotionCard variants={cardVariants} className="rounded-xl">
      <CardContent className="py-4">
        <div className="text-center space-y-2">
          <h3 className="font-medium text-black">How was your experience?</h3>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "w-24 border border-green-500 hover:bg-green-50",
                feedback === "like" &&
                  "bg-green-500 hover:bg-green-500 text-white hover:text-white"
              )}
              onClick={() => handleFeedback("like")}
              disabled={feedback !== null}
            >
              <AnimatePresence mode="wait">
                <MotionThumbsUp
                  className={cn(
                    "h-5 w-5 text-green-500",
                    feedback === "like" && "text-white"
                  )}
                  animate={
                    feedback === "like"
                      ? {
                          scale: [1, 1.5, 1],
                          rotate: [0, -45, 0],
                          transition: {
                            duration: 0.5,
                            ease: "easeOut",
                          },
                        }
                      : {}
                  }
                />
              </AnimatePresence>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "w-24 border border-red-500 hover:bg-red-50",
                feedback === "dislike" &&
                  "bg-red-500 hover:bg-red-500 text-white hover:text-white"
              )}
              onClick={() => handleFeedback("dislike")}
              disabled={feedback !== null}
            >
              <MotionThumbsDown
                className={cn(
                  "h-5 w-5 text-red-500",
                  feedback === "dislike" && "text-white"
                )}
              />
            </Button>
          </div>
          <AnimatePresence mode="wait">
            {feedback === "dislike" && !isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="text-sm text-muted-foreground">
                  Tell us what we can improve
                </p>
                <Textarea
                  placeholder="Your feedback helps us get better"
                  value={improvementFeedback}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setImprovementFeedback(e.target.value)
                  }
                  className="min-h-[100px] resize-none"
                />
                <Button
                  variant="otter"
                  onClick={handleSubmitImprovement}
                  disabled={!improvementFeedback.trim()}
                >
                  <Send className="h-4 w-4" />
                  Send Feedback
                </Button>
              </motion.div>
            )}
            {isSubmitted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground"
              >
                Thank you for your feedback!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </MotionCard>
  );
}

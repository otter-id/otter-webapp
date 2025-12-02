"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cardVariants } from "@/app/receipt/utils/animations";

export function Footer() {
  return (
    <motion.div variants={cardVariants} className="text-center text-sm text-muted-foreground mb-4">
      <span>Powered by</span>
      <Image src="/img/OtterLogo.svg" alt="Otter" width={60} height={20} className="inline-block pl-2" draggable={false} />
    </motion.div>
  );
}

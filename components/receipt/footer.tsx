"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cardVariants } from "@/app/receipt/utils/animations";

export function Footer() {
  return (
    <motion.div variants={cardVariants} className="mb-4 text-center text-muted-foreground text-sm">
      <span>Powered by</span>
      <Image src="/img/OtterLogo.svg" alt="Otter" width={60} height={20} className="inline-block pl-2" draggable={false} />
    </motion.div>
  );
}

"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedGridProps {
  className?: string
}

export function AnimatedGrid({ className }: AnimatedGridProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Animated dots */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-foreground/40"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [1, 1, 1],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
  )
}

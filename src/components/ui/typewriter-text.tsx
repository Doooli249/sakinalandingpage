"use client";

import { motion } from "framer-motion";

export function TypewriterText({
  text,
  delay = 0,
  speed = 0.04, // seconds between each character
  className = "",
  showCursor = false,
  cursorClassName = "bg-charcoal",
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  showCursor?: boolean;
  cursorClassName?: string;
}) {
  const characters = Array.from(text);
  
  // Calculate when the cursor should start flashing
  const typingDuration = characters.length * speed;
  const cursorDelay = delay + typingDuration;

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: speed,
            delayChildren: delay,
          },
        },
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${index}`}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { duration: 0.3, ease: "easeOut" } 
            },
          }}
        >
          {char}
        </motion.span>
      ))}
      {showCursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "linear",
            delay: cursorDelay,
          }}
          className={`inline-block w-[3px] h-[0.9em] translate-y-[0.1em] ml-1 ${cursorClassName}`}
        />
      )}
    </motion.span>
  );
}

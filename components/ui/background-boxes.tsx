"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Violet/indigo-only palette to match the site theme
const COLORS = [
  "rgba(139, 92, 246, 0.90)",   // violet-500
  "rgba(167, 139, 250, 0.85)",  // violet-400
  "rgba(196, 181, 253, 0.80)",  // violet-300
  "rgba(109,  40, 217, 0.88)",  // violet-700
  "rgba( 79,  70, 229, 0.85)",  // indigo-600
  "rgba( 99, 102, 241, 0.82)",  // indigo-500
  "rgba(124,  58, 237, 0.88)",  // violet-600
  "rgba(221, 214, 254, 0.75)",  // violet-200
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const BoxesCore = ({ className, light = false, ...rest }: { className?: string; light?: boolean }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  const border = light ? "border-black/[0.08]" : "border-white/[0.10]";

  return (
    <div
      style={{
        transform:
          "translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)",
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={"row" + i}
          className={`w-16 h-8 border-l ${border} relative`}
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{ transition: { duration: 2 } }}
              key={"col" + j}
              className={`w-16 h-8 border-r border-t ${border} relative`}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-white/[0.06] stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);

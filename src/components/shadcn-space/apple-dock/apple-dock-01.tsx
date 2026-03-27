"use client";

import React, { PropsWithChildren, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionProps } from "motion/react";
import {
  Home,
  AlertTriangle,
  Shield,
  Users,
  Ticket,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppleDockProps extends VariantProps<typeof appleDockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLEMAGNIFICATION = false;

const appleDockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md",
);

const AppleDock = React.forwardRef<HTMLDivElement, AppleDockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (
          React.isValidElement<AppleDockIconProps>(child) &&
          child.type === AppleDockIcon
        ) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX: mouseX,
            size: iconSize,
            magnification: iconMagnification,
            disableMagnification: disableMagnification,
            distance: iconDistance,
          });
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(appleDockVariants({ className }), {
          "items-start": direction === "top",
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
        })}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

AppleDock.displayName = "AppleDock";

export interface AppleDockIconProps extends Omit<
  MotionProps & React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const AppleDockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: AppleDockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const targetScale = disableMagnification ? 1 : magnification / size;

  const scaleTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [1, targetScale, 1],
  );

  const scale = useSpring(scaleTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size, padding, scale }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        disableMagnification && "hover:bg-muted-foreground transition-colors",
        className,
      )}
      {...props}
    >
      <div>{children}</div>
    </motion.div>
  );
};

AppleDockIcon.displayName = "AppleDockIcon";

export function SakinaDock() {
  type IconData = {
    IconComponent: LucideIcon;
    bgColor: string;
    textColor: string;
    label: string;
    href: string;
  };

  const dockIcons: IconData[] = [
    {
      IconComponent: Home,
      bgColor: "bg-charcoal/5 hover:bg-charcoal/10",
      textColor: "text-charcoal/70 hover:text-charcoal",
      label: "Home",
      href: "#hero",
    },
    {
      IconComponent: AlertTriangle,
      bgColor: "bg-rose/10 hover:bg-rose/20",
      textColor: "text-rose/80 hover:text-rose",
      label: "The Problem",
      href: "#problem",
    },
    {
      IconComponent: Shield,
      bgColor: "bg-champagne/15 hover:bg-champagne/25",
      textColor: "text-champagne/90 hover:text-champagne",
      label: "Solution",
      href: "#solution",
    },
    {
      IconComponent: Users,
      bgColor: "bg-mauve/15 hover:bg-mauve/25",
      textColor: "text-mauve/90 hover:text-mauve",
      label: "Personas",
      href: "#personas",
    },
    {
      IconComponent: Ticket,
      bgColor: "bg-rose/15 hover:bg-rose/25",
      textColor: "text-rose",
      label: "Waitlist",
      href: "#waitlist",
    },
  ];

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100]">
      <div className="relative">
        <AppleDock iconSize={44} iconMagnification={54} iconDistance={100} className="rounded-full bg-white/40 shadow-sm border-white/20">
          {dockIcons.map(({ IconComponent, bgColor, textColor, label, href }) => (
            <a href={href} key={label} className="outline-none" aria-label={label} title={label}>
              <AppleDockIcon
                className={cn(bgColor, textColor, "transition-colors duration-200")}
              >
                <IconComponent className="w-5 h-5" />
              </AppleDockIcon>
            </a>
          ))}
        </AppleDock>
      </div>
    </div>
  );
}

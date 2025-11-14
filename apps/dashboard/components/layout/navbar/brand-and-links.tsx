"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@nuge/ui";
import { cn } from "@nuge/ui";
import { ChevronDown } from "lucide-react";

interface NavbarBrandAndLinksProps {
  isSolutionsOpen: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onSolutionsMouseEnter: () => void;
  onSolutionsMouseLeave: () => void;
  onToggleSolutions: () => void;
}

export const NavbarBrandAndLinks = ({
  isSolutionsOpen,
  triggerRef,
  onSolutionsMouseEnter,
  onSolutionsMouseLeave,
  onToggleSolutions,
}: NavbarBrandAndLinksProps) => {
  return (
    <div className="flex items-center gap-18">
      <Link
        href="/"
        className="transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      >
        <Logo bodyColor="#0D101A" size={52} />
      </Link>

      <div className="flex items-center gap-12 text-[#0D101A] font-medium">
        <Link
          href="/"
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
        >
          <span className="relative z-10">Home</span>
        </Link>

        {/* Solutions Dropdown Trigger */}
        <div className="relative">
          <button
            ref={triggerRef}
            onMouseEnter={onSolutionsMouseEnter}
            onMouseLeave={onSolutionsMouseLeave}
            onClick={onToggleSolutions}
            className={cn(
              "relative group transition-colors duration-200 hover:text-[#0D101A]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-0.5 flex items-center gap-1",
              isSolutionsOpen && "text-[#0D101A]"
            )}
          >
            <span className="relative z-10">Solutions</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                isSolutionsOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        <Link
          href="/resources"
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
        >
          <span className="relative z-10">Resources</span>
        </Link>
        <Link
          href="/pricing"
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
        >
          <span className="relative z-10">Pricing</span>
        </Link>
      </div>
    </div>
  );
};

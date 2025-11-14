"use client";

/**
 * Navbar
 *
 * High‑level dashboard navigation bar that:
 * - Shows the brand and primary navigation links.
 * - Provides a rich “Solutions” dropdown showcasing key product areas.
 * - Renders authentication‑aware user controls (avatar, profile menu, sign out).
 *
 * Detailed UI pieces such as the solutions dropdown and user menu are implemented
 * in the files inside this `navbar` folder to keep this component focused on
 * layout and orchestration.
 */

import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@nuge/api";
import { NavbarBrandAndLinks } from "./brand-and-links";
import { NavbarUserSection } from "./user-section";
import { SolutionsDropdownPanel } from "./solutions-dropdown";

export function Navbar() {
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsSolutionsOpen(false);
      }
    };

    if (isSolutionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSolutionsOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSolutionsOpen(false);
    }, 150);
  };

  return (
    <nav className="flex items-center justify-between max-w-[90%] mx-auto w-full py-4 relative">
      <div className="absolute inset-0 -z-10 bg-background/80 backdrop-blur-sm" />

      <div className="flex items-center w-full justify-between">
        {/* Brand + primary navigation links */}
        <NavbarBrandAndLinks
          isSolutionsOpen={isSolutionsOpen}
          triggerRef={triggerRef}
          onSolutionsMouseEnter={handleMouseEnter}
          onSolutionsMouseLeave={handleMouseLeave}
          onToggleSolutions={() => setIsSolutionsOpen((prev) => !prev)}
        />

        {/* Authentication‑aware user section */}
        <NavbarUserSection isAuthenticated={!!isAuthenticated} />
      </div>

      {/* Dropdown Menu - Positioned relative to navbar */}
      <SolutionsDropdownPanel
        isOpen={isSolutionsOpen}
        dropdownRef={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </nav>
  );
}

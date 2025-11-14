"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@nuge/ui";
import { ArrowRight, Code, Puzzle, Radio } from "lucide-react";

// Developer platform
const solutionTechnologies = [
  {
    id: "tech-1",
    title: "Nuge API",
    description: "RESTful endpoints for location data",
    href: "/developers/api",
    icon: Code,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "tech-2",
    title: "Real-Time Webhooks",
    description: "Instant location updates and notifications",
    href: "/developers/webhooks",
    icon: Radio,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "tech-3",
    title: "Mapping & Presence SDK",
    description: "Embed maps and presence features",
    href: "/developers/sdk",
    icon: Puzzle,
    color: "from-orange-500 to-orange-600",
  },
];

interface SolutionsDropdownPanelProps {
  isOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const SolutionsDropdownPanel = ({
  isOpen,
  dropdownRef,
  onMouseEnter,
  onMouseLeave,
}: SolutionsDropdownPanelProps) => {
  return (
    <div
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 -mt-2 w-[92vw] max-w-7xl bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden transition-all duration-300 ease-out z-50",
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-[#ab82ec]/5 via-transparent to-blue-500/5 pointer-events-none" />

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0D101A 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative p-8">
        {/* MAIN GRID SECTION */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          {/* LEFT CTA PANEL - Hero */}
          <Link
            href="/platform"
            className="lg:col-span-2 bg-linear-to-br from-[#ab82ec] via-[#9d6fe8] to-[#8f5ce3] text-background group relative flex h-full flex-col justify-between overflow-hidden rounded-xl px-8 py-10 transition-all"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  Illuminate Your Location
                </span>
              </div>
              <h3 className="text-2xl font-bold leading-tight mb-4">
                Bring Visibility to Every Moment You Create
              </h3>
              <p className="text-sm opacity-90 leading-relaxed max-w-md">
                Share your presence in real-time, reach more people instantly,
                and empower your community with dynamic location discovery.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between">
              <div className="flex items-center text-sm font-semibold group-hover:gap-3 transition-all gap-2">
                Explore the Nuge Platform
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* RIGHT DEV PANEL */}
          <div className="lg:py-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-4 h-4 text-[#0D101A]/60" />
                <strong className="text-[#0D101A]/70 text-xs font-semibold uppercase tracking-wider">
                  Developer Tools
                </strong>
              </div>
            </div>
            <div className="grid gap-3">
              {solutionTechnologies.map((technology) => {
                const Icon = technology.icon;
                return (
                  <Link
                    key={technology.id}
                    href={technology.href}
                    className="group relative p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 hover:border-border transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "p-2 rounded-lg bg-linear-to-br",
                          technology.color,
                          "shadow-sm group-hover:shadow-md transition-shadow"
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0D101A] mb-1">
                          {technology.title}
                        </div>
                        <div className="text-xs text-[#0D101A]/60 line-clamp-1">
                          {technology.description}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#0D101A]/40 group-hover:text-[#0D101A] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

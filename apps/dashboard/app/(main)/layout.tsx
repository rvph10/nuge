import Navbar from "@/components/layout/navbar";
import React from "react";

/**
 * This layout applies to all pages inside the (main) group.
 * It adds the Navbar and the max-width container.
 */
export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1400px] mx-auto">
      <Navbar />
      {children}
    </div>
  );
}

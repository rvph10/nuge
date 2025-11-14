import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@nuge/api";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "@nuge/ui";

export const metadata: Metadata = {
  title: "Nuge for Creators",
  description: "Manage your mobile business or events on Nuge",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nuge for Creators",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Toaster
            position="top-center"
            richColors={false}
            closeButton
            expand={false}
            duration={4000}
          />{" "}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

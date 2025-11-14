import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@nuge/api";

export const metadata: Metadata = {
  title: "Nuge",
  description: "",
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
    title: "Nuge",
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

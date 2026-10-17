import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Travel — To the Unknown",
  description:
    "Find your next escape with Travel — thoughtful tours, unforgettable places, and adventures made for you.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

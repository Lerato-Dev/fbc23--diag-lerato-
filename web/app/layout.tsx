import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FBC23 Task Tracker",
  description: "A simple task management application."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/redux/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Construction Tracking Portal",
  description: "Tracking made easier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased min-h-svh`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

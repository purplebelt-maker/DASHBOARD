import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Providers from "@/providers";

export const metadata: Metadata = {
  title: "Polymarket Dashboard | Live Prediction Market Data",
  description:
    "Live prediction market data dashboard showing top Polymarket markets by volume",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.PNG",
    shortcut: "/favicon.PNG",
    apple: "/favicon.PNG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

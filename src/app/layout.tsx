import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AccountsProvider } from "@/lib/context/AccountsContext";
import { TransactionsProvider } from "@/lib/context/TransactionsContext";
import { PaymentsProvider } from "@/lib/context/PaymentsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STVBLE | B2B Fintech Banking Dashboard",
  description: "Professional banking dashboard for B2B fintech operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AccountsProvider>
            <PaymentsProvider>
              <TransactionsProvider>
                <TooltipProvider>
                  <AppShell>{children}</AppShell>
                  <Toaster position="top-right" />
                </TooltipProvider>
              </TransactionsProvider>
            </PaymentsProvider>
          </AccountsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

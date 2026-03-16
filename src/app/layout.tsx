import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HealthProvider } from "@/lib/health-context";
import AppShell from "@/components/app-shell";
import BuddyChat from "@/components/buddy-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Health Buddy",
  description: "Your AI-powered personal fitness and health companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Health Buddy",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <HealthProvider>
            <AppShell>
              {children}
            </AppShell>
            <BuddyChat />
            {/* Service Worker Registration */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/service-worker.js').then(
                        function(registration) {
                          console.log('Service Worker registration successful with scope: ', registration.scope);
                        },
                        function(err) {
                          console.log('Service Worker registration failed: ', err);
                        }
                      );
                    });
                  }
                `,
              }}
            />
          </HealthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

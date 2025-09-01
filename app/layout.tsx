import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import { Settings } from "lucide-react";
import Link from "next/link";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "dog poop logger",
  description: "track your dog's poops",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${notoSansJP.variable} ${zenKakuGothicNew.variable} font-noto antialiased`}
        >
          <header className="flex justify-end items-center px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-4">
            <SignedOut>
              <SignInButton>
                <button className="text-[var(--foreground)] hover:text-[var(--accent-green)] font-noto font-light text-sm sm:text-base transition-colors duration-300 px-3 py-2 rounded-sketch hover:bg-[var(--accent-lighter)]">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-[var(--background)] font-noto font-light text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 cursor-pointer border-[1.5px] border-[var(--accent-green)] hover:border-[var(--accent-green-hover)] rounded-sketch relative hover:transform hover:translate-y-[-0.5px] hover:shadow-[0_2px_4px_var(--shadow-soft)] transition-all duration-300 ease-out">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link 
                href="/settings"
                className="text-[var(--foreground)] hover:text-[var(--accent-green)] font-noto font-light text-sm sm:text-base transition-colors duration-300 px-3 py-2 rounded-sketch hover:bg-[var(--accent-lighter)] flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <UserButton />
            </SignedIn>
          </header>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
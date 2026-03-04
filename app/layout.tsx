import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Load the modern "Outfit" font
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Speak Easy | Master Difficult Conversations",
  description: "Practice salary negotiations and tough feedback in a safe, AI-powered environment.",
  // Automatically creates a sleek microphone emoji favicon!
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
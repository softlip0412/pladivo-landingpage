import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import Chatbot from "@/components/shared/chat-bot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pladivo - Event Booking System",
  description: "Your premier destination for event booking and services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" richColors />
        <Chatbot />
      </body>
    </html>
  );
}

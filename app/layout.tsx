import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Justin Beaudry | Engineer & Architect",
  description: "Engineer and Architect focused on the transition from legacy workflows to AI-first systems. Bridging Silicon Valley scale and Midwest talent.",
  keywords: ["Justin Beaudry", "AI", "Engineering", "Architecture", "Toledo", "AI Collective", "EmpoweredAI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

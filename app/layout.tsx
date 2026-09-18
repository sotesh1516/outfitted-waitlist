import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outfitted — See the fit before you buy",
  description: "Try on clothes with your avatar, share complete fits with friends, and get a quick personalized fit check before you buy.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

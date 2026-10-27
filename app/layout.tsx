import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cat-alyst Admin", description: "Private admin for Meme Caption Lab" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

"use client";
import "./globals.css";
import local from "@/globals/local";

export const metadata = {
  title: local.ru.text.APP_NAME,
  description: local.ru.text.APP_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

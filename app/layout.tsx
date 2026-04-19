import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deen's Daily Hub | Premium Deals & More",
  description: "Your local hub for the best deals, hot finds, and stock tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`antialiased min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}

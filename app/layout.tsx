import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Schulte Trainer",
  description: "Schulte table trainer",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;

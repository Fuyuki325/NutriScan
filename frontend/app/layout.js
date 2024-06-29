import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nutrition Scanner",
  description: "Nutrition made easy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>{metadata.title}</title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

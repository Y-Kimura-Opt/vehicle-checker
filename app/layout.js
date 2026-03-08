import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "車両積載判定ツール",
  description: "貨物サイズから最適な車両を判定するシミュレーションツール",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

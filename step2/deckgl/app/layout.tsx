import "@/lib/global.css";

export const metadata = {
  title: "deck.gl - WebGISに関する技術調査レポート",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

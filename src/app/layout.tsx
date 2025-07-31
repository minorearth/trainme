import { L } from "tpconst/lang";

export const metadata = {
  title: L.ru.text.APP_NAME,
  description: L.ru.text.APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

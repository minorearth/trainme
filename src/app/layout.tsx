import { L } from "@/tpconst/src/lang";

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
    <html lang="en" style={{ height: "100%", width: "100%" }}>
      <body style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}

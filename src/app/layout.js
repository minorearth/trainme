import "./globals.css";
import local from "@/globals/local";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/theme";

export const metadata = {
  title: local.ru.text.APP_NAME,
  description: local.ru.text.APP_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <body>{children}</body>
      </ThemeProvider>
    </html>
  );
}

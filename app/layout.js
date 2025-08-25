import { Toaster } from "react-hot-toast";
import "./globals.css";
import "react-phone-number-input/style.css";

export const metadata = {
  title: "Arnio SaaS",
  description: "Saas conversation platform for your business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Toaster position="top-right" />
        <main>{children}</main>
      </body>
    </html>
  );
}

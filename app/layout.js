import Providers from "@/components/Providers";
import "./globals.css";
import "react-phone-number-input/style.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Arnio Dashboard",
  description: "Saas conversation platform for your business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

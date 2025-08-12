import "./globals.css";

export const metadata = {
  title: "Arnio SaaS",
  description: "Saas conversation platform for your business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "Ayanokouji // Empire",
  description: "Personal command dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

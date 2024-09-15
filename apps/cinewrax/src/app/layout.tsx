export const metadata = {
  title: "Cinewrax - Audio File Converter",
  description: "Effortlessly convert your audio files to any format in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

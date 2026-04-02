import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IELTS AI Coach — Luyện thi IELTS thông minh",
  description: "Nền tảng luyện thi IELTS toàn diện với AI, cá nhân hóa lộ trình học và phản hồi tức thì.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kanban - Project Management Board',
  description: 'A slick, professional single-board Kanban project management application',
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

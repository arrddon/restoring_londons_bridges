import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: "Restoring London's Bridges",
  icons: { icon: '/favicon.svg' },
  description: "Explore London's bridges through interactive maps and AR experiences.",
  openGraph: { title: "Restoring London's Bridges", description: "Explore London's bridges through interactive maps and AR experiences.", type: 'website' },
  twitter: { card: 'summary', title: "Restoring London's Bridges", description: "Explore London's bridges through interactive maps and AR experiences." },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

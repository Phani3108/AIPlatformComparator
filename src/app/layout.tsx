import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Platform Decision Engine',
  description:
    'Enterprise-grade platform evaluation for GenAI workloads — Vertex AI vs Azure OpenAI vs AWS Bedrock',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}

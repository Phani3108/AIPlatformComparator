import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Platform Decision Engine',
  description:
    'Enterprise-grade platform evaluation for GenAI workloads — Vertex AI vs Azure OpenAI vs AWS Bedrock',
  authors: [{ name: 'Phani Marupaka', url: 'https://linkedin.com/in/phani-marupaka' }],
  creator: 'Phani Marupaka',
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
        <footer
          style={{
            textAlign: 'center',
            padding: '12px 16px',
            fontSize: '0.75rem',
            color: '#9e9e9e',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          Created & developed by{' '}
          <a
            href="https://linkedin.com/in/phani-marupaka"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#5f6368', textDecoration: 'none' }}
          >
            Phani Marupaka
          </a>
          {' · '}
          © 2026 Phani Marupaka. All rights reserved.
        </footer>
      </body>
    </html>
  );
}

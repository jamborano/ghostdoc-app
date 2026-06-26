import DemoPreviewClient from '@/components/DemoPreviewClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GhostDoc Demo — Live Codebase Analysis & Automated Documentation',
  description: 'Experience GhostDoc AI in action. Preview automated documentation, security audits, API contracts, and executive summaries for Supabase, Cal.com, and OWASP Juice Shop — all with zero data retention.',
  keywords: [
    'GhostDoc demo',
    'AI code documentation',
    'automated API docs',
    'security audit tool',
    'Supabase documentation',
    'Cal.com architecture',
    'DevSecOps automation',
    'technical debt analysis',
    'zero retention documentation',
    'Jamborano Tech Studio'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'GhostDoc Demo — Live AI Codebase Analysis',
    description: 'See how GhostDoc generates production-grade documentation, security reports, and executive summaries from any GitHub repository — instantly and securely.',
    url: 'https://ghostdoc.dev/demo',
    siteName: 'GhostDoc',
    type: 'website',
    images: [
      {
        url: 'https://ghostdoc.dev/og-demo.png',
        width: 1200,
        height: 630,
        alt: 'GhostDoc AI Documentation Demo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GhostDoc Demo — Live Code Documentation Preview',
    description: 'Interactive sandbox to explore GhostDoc\'s deep code analysis, security audit, and executive reporting capabilities.',
    site: '@ghostdoc',
    creator: '@jamborano'
  },
  alternates: {
    canonical: 'https://ghostdoc.dev/demo'
  }
};

export default function DemoPage() {
  return <DemoPreviewClient />;
}
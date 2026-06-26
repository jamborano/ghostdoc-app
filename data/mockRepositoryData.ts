export interface VulnerabilityItem {
  id: string;
  severity: 'HIGH' | 'MED' | 'LOW';
  title: string;
  remediation: string;
}

export interface RepoDetails {
  id: string;
  name: string;
  scaleType: string;
  filesMapped: number;
  computeCredits: number;
  requiredTier: string;
  priceLabel: string;
  gumroadLink: string;
  isOverlimit: boolean;
  readmeContent: {
    status: string;
    title: string;
    description: string;
    architectureTitle: string;
    architectureBlock: string;
  };
  apiContent: {
    title: string;
    description: string;
    contractTitle: string;
    contractBlock: string;
  };
  securityContent: {
    title: string;
    vulnerabilities: VulnerabilityItem[];
  };
  executiveContent: {
    title: string;
    description: string;
    techDebtRange: string;
    remediationTime: string;
  };
}

export const mockRepositoryData: Record<string, RepoDetails> = {
  'juice-shop': {
    id: 'juice-shop',
    name: 'bkimminich/juice-shop (Standard)',
    scaleType: 'Standard Stack Detected',
    filesMapped: 412,
    computeCredits: 45210,
    requiredTier: 'Core Bundle ($9)',
    priceLabel: '$9',
    gumroadLink: 'https://gumroad.com/l/ghostdoc-core-9',
    isOverlimit: false,
    readmeContent: {
      status: 'ANALYSIS STATUS: PASSED (45,210 TOKENS)',
      title: '# OWASP Juice Shop Architecture Base',
      description: 'Intentionally damp web application demonstrating OWASP Top 10 vulnerabilities, packaged with Express, Node.js, and Sequelize ORM mappings.',
      architectureTitle: '## System Architecture Matrix',
      architectureBlock: `frontend/src/app/   # Angular SPA Client View
server.ts          # Express Node Application Layer
data/              # SQLite Database Local Storage Mappings`
    },
    apiContent: {
      title: '# REST API Reference Model',
      description: 'Exposes loosely-typed endpoints handling typical e-commerce operations, user authentications, and feedback inputs.',
      contractTitle: '## API Endpoint Surface',
      contractBlock: `POST /api/Users
Payload: { email: string, password: string }
Response: 201 Created (JSON Web Token Payload)`
    },
    securityContent: {
      title: '🛡️ Vulnerability Audit Spectrum',
      vulnerabilities: [
        { id: 'VULN-JS-01', severity: 'HIGH', title: 'SQL Injection via Product Search Filters', remediation: 'Implement strict parameterized input clauses or Sequelize query options bounds.' },
        { id: 'VULN-JS-02', severity: 'MED', title: 'Broken Object Level Authorization', remediation: 'Enforce structural access verification on basket-id session tokens.' }
      ]
    },
    executiveContent: {
      title: '📊 Executive Risk Strategy & Technical Valuations',
      description: 'Financial exposure data correlating to unpatched compliance risks within open-source dependencies and standard web vulnerabilities.',
      techDebtRange: '$12,000 - $18,000',
      remediationTime: '2 Business Weeks'
    }
  },

  'calcom': {
    id: 'calcom',
    name: 'calcom/cal.com (Enterprise Fork)',
    scaleType: 'Enterprise Scale Monorepo',
    filesMapped: 2450,
    computeCredits: 320450,
    requiredTier: 'Enterprise Vault ($99)',
    priceLabel: '$99',
    gumroadLink: 'https://gumroad.com/l/ghostdoc-enterprise-99',
    isOverlimit: true,
    readmeContent: {
      status: 'ANALYSIS STATUS: PASSED (320,450 TOKENS)',
      title: '# Cal.com Scheduling Infrastructure',
      description: 'Monorepo architecture executing cross-organizational calendaring APIs, engineered with Next.js App Router, tRPC endpoints, and strict Prisma layouts.',
      architectureTitle: '## Multi-Package Dependency Layering',
      architectureBlock: `apps/web           # Next.js App Core Interface Layer[cite: 6]
packages/lib       # Central Business Utility Engine[cite: 6]
packages/features  # Shared Modulated Component Workspaces[cite: 6]`
    },
    apiContent: {
      title: '# tRPC Contract & API Surfaces',
      description: 'Maintains strongly-typed asynchronous routing pipelines validated directly via rigorous runtime runtime validators.',
      contractTitle: '## tRPC bookings.create Validation Schema[cite: 5]',
      contractBlock: `z.object({
  eventTypeId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  responses: z.object({ name: z.string(), email: z.string().email() })
})`
    },
    securityContent: {
      title: '🛡️ Architectural Security & Isolation Matrix',
      vulnerabilities: [
        { id: 'VULN-CAL-01', severity: 'HIGH', title: 'Cross-Tenant Event Modification Vector', remediation: 'Bind user verification checks explicitly to team-id router constraints.' },
        { id: 'VULN-CAL-02', severity: 'MED', title: 'Insecure Webhook Signature Decryption', remediation: 'Utilize specialized standard cryptographic validations on incoming header signatures.' }
      ]
    },
    executiveContent: {
      title: '📊 Executive Strategy & Tech Debt Valuations',
      description: 'Strategic calculations translating system architecture flaws into tangible integration velocity and structural business impacts[cite: 8].',
      techDebtRange: '$85,000 - $130,000',
      remediationTime: '4-6 Calendar Weeks'
    }
  },

  'supabase': {
    id: 'supabase',
    name: 'supabase/supabase (Monolithic Architecture)',
    scaleType: 'Monolithic Scale Detected',
    filesMapped: 7775,
    computeCredits: 1430600,
    requiredTier: 'Enterprise Vault ($99)',
    priceLabel: '$99',
    gumroadLink: 'https://gumroad.com/l/ghostdoc-enterprise-99',
    isOverlimit: true,
    readmeContent: {
      status: 'OVERLIMIT WARNING: RESOURCE COMPILATION RESTRICTED (1,430,600 CREDITS)',
      title: '# Supabase Core Infrastructure Layout[cite: 6]',
      description: 'A deeply scalable, production-grade open-source backend ecosystem incorporating PostgreSQL integrations, auth engines, real-time edge servers, and heavy Next.js administrative studios[cite: 6].',
      architectureTitle: '## Monorepo Topology Mappings[cite: 6]',
      architectureBlock: `apps/studio/       # Next.js Dashboard Studio[cite: 6]
packages/pg-meta/  # Native PostgreSQL Metadata Client Engine[cite: 6]
packages/ui/       # Accessible Primitive Component Library[cite: 6]`
    },
    apiContent: {
      title: '# Internal Studio API Infrastructure[cite: 5]',
      description: 'Schedules state-controlled multi-tenant access models while protecting core analytical workflows from cross-platform escape sequences.',
      contractTitle: '## Safe SQL Provenance Boundaries',
      contractBlock: `type SafeSqlFragment  = string & { __brand: 'SafeSqlFragment' }[cite: 5]
type UntrustedSqlFragment = string & { __brand: 'UntrustedSqlFragment' }[cite: 5]
type SafeLogSqlFragment = string & { __brand: 'SafeLogSqlFragment' }[cite: 5]`
    },
    securityContent: {
      title: '🛡️ Deep DevSecOps Audit & Threat Vectors[cite: 7]',
      vulnerabilities: [
        { id: 'V-001', severity: 'HIGH', title: 'Compile-Time Exclusive Verification for SafeSqlFragment[cite: 7]', remediation: 'Inject hard runtime validators directly inside the native query engine boundary[cite: 7].' },
        { id: 'V-003', severity: 'MED', title: 'Dev Toolbar Production Guard Expandable[cite: 7]', remediation: 'Inject build-time constants to replace simple runtime check guards[cite: 7].' }
      ]
    },
    executiveContent: {
      title: '📊 Boardroom Valuation & Technical Architecture Debt[cite: 8]',
      description: 'Strategic infrastructure assessment mapping code flaws to organizational costs and technical enterprise liabilities[cite: 8].',
      techDebtRange: '$150,000 - $250,000[cite: 8]',
      remediationTime: '1 Full Fiscal Quarter[cite: 8]'
    }
  }
};
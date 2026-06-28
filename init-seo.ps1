# ============================================================
# init-seo.ps1 — Setup GhostDoc SEO & Engineering Resources
# ============================================================

Write-Host "🚀 Starting GhostDoc SEO & Resources Setup..." -ForegroundColor Cyan

# 1. BUAT sitemap.xml
Write-Host "📄 Creating sitemap.xml..." -ForegroundColor Yellow
$sitemap = @'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ghostdoc.dev/</loc>
    <lastmod>2026-06-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ghostdoc.dev/demo</loc>
    <lastmod>2026-06-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://ghostdoc.dev/testimonials</loc>
    <lastmod>2026-06-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- ===== GUIDES ===== -->
</urlset>
'@
$sitemap | Out-File -FilePath "public/sitemap.xml" -Encoding utf8

# 2. BUAT robots.txt
Write-Host "📄 Creating robots.txt..." -ForegroundColor Yellow
$robots = @'
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://ghostdoc.dev/sitemap.xml
'@
$robots | Out-File -FilePath "public/robots.txt" -Encoding utf8

# 3. BUAT FOLDER
Write-Host "📁 Creating folders..." -ForegroundColor Yellow
$folders = @(
    "app/guides",
    "app/guides/[slug]",
    "content/guides",
    "app/api/guides",
    "app/api/guides/[slug]"
)
foreach ($f in $folders) {
    New-Item -ItemType Directory -Path $f -Force | Out-Null
}
Write-Host "✅ Folders created." -ForegroundColor Green

# 4. BUAT FILE API LIST
Write-Host "📡 Creating API endpoints..." -ForegroundColor Yellow
$apiList = @'
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const guidesDirectory = path.join(process.cwd(), 'content/guides');
  if (!fs.existsSync(guidesDirectory)) {
    return NextResponse.json([]);
  }
  const filenames = fs.readdirSync(guidesDirectory);
  const guides = filenames.map((filename) => {
    const filePath = path.join(guidesDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || '',
    };
  });
  return NextResponse.json(guides);
}
'@
Set-Content -LiteralPath "app/api/guides/route.ts" -Value $apiList -Encoding utf8

# 5. BUAT FILE API DETAIL
$apiDetail = @'
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(req, { params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content/guides', `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(null, { status: 404 });
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  return NextResponse.json({
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || '',
    content: content,
  });
}
'@
Set-Content -LiteralPath "app/api/guides/[slug]/route.ts" -Value $apiDetail -Encoding utf8

# 6. BUAT HALAMAN DAFTAR GUIDES
$guidesPage = @'
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GuidesPage() {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    fetch('/api/guides')
      .then(res => res.json())
      .then(data => setGuides(data))
      .catch(() => setGuides([]));
  }, []);

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Engineering Resources
          </span>
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl mb-12 font-mono">
          Guides, best practices, and deep dives into automated documentation, zero-retention security, and DevSecOps audits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="bg-[#1e1f20]/60 p-6 rounded-2xl border border-neutral-800/80 hover:border-blue-500/30 transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-white mb-2">{guide.title}</h2>
              <p className="text-sm text-neutral-400">{guide.description}</p>
              {guide.date && <p className="text-xs text-neutral-500 mt-3 font-mono">{guide.date}</p>}
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
'@
Set-Content -LiteralPath "app/guides/page.tsx" -Value $guidesPage -Encoding utf8

# 7. BUAT HALAMAN DETAIL GUIDE
$guidesDetail = @'
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug;
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/guides/${slug}`)
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex items-center justify-center">
        <p className="text-neutral-400 font-mono">Loading...</p>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] flex items-center justify-center">
        <p className="text-neutral-400 font-mono">Guide not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0d12] text-[#F5F5DC] font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="h-[600px] w-[900px] bg-blue-700/10 rounded-full blur-[200px] opacity-70"></div>
      </div>
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <Link href="/guides" className="text-blue-400 hover:text-blue-300 text-sm font-mono mb-6 inline-block">
          ← Back to Resources
        </Link>
        <h1 className="text-4xl font-black text-white mb-4">{content.title}</h1>
        {content.date && <p className="text-sm text-neutral-500 font-mono mb-8">{content.date}</p>}
        <div className="prose prose-invert prose-blue max-w-none">
          {content.content.split('\n').map((line, i) => (
            <p key={i} className="text-neutral-300 text-sm leading-relaxed">{line}</p>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-800/60">
          <Link href="/guides" className="text-blue-400 hover:text-blue-300 text-sm font-mono">
            ← All Resources
          </Link>
        </div>
      </div>
    </main>
  );
}
'@
Set-Content -LiteralPath "app/guides/[slug]/page.tsx" -Value $guidesDetail -Encoding utf8

# 8. BUAT CONTOH GUIDE (pakai array of strings)
Write-Host "📝 Creating example guide..." -ForegroundColor Yellow
$guideLines = @(
"---",
"title: ""Zero-Retention Documentation: Why Enterprises Are Moving Away from Stored Codebases""",
"description: ""Learn why zero-retention is becoming a standard requirement for enterprise documentation, and how GhostDoc implements it.""",
"date: ""June 29, 2026""",
"---",
"",
"## The Problem: Stored Code = Security Risk",
"",
"Enterprises are increasingly wary of storing their proprietary codebases on third-party platforms. Even with encryption, the risk of data breaches, insider threats, and compliance violations is too high.",
"",
"**GhostDoc solves this with ephemeral compute nodes.**",
"",
"## How Zero-Retention Works",
"",
"1. **Ephemeral Node** - Your codebase is streamed into a temporary, isolated container.",
"2. **On-the-Fly Analysis** - The system maps your architecture, dependencies, and security posture.",
"3. **Instant Vaporization** - The node is destroyed immediately after the documentation payload is generated.",
"",
"## Why This Matters",
"",
"- **Compliance** - SOC2, ISO, and GDPR requirements are met without storing any data.",
"- **Trust** - Your IP never leaves your control.",
"- **Speed** - No long-term setup, just instant documentation.",
"",
"## GhostDoc's Implementation",
"",
"GhostDoc uses Modal.com infrastructure to spin up zero-retention nodes on demand. Each scan is completely isolated, and logs are purged automatically.",
"",
"```python",
"# No data retention - everything is ephemeral",
"ephemeral_node.process(codebase)",
"del ephemeral_node  # destroyed",
"```",
"",
"## Ready to Try It?",
"",
"[→ Get Your Docs in 4 Minutes](https://jamborano.gumroad.com/l/ghostdoc)"
)
$guideContent = $guideLines -join "`n"
$guideContent | Out-File -FilePath "content/guides/zero-retention-documentation.md" -Encoding utf8

# 9. INSTALL DEPENDENCIES
Write-Host "📦 Installing required packages..." -ForegroundColor Yellow
npm install gray-matter --save-dev

# 10. UPDATE SITEMAP (tambah guide)
Write-Host "🗺️ Updating sitemap..." -ForegroundColor Yellow
$sitemapContent = Get-Content "public/sitemap.xml" -Raw
$guideEntry = @"
  <url>
    <loc>https://ghostdoc.dev/guides/zero-retention-documentation</loc>
    <lastmod>$(Get-Date -Format 'yyyy-MM-dd')</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
"@
$sitemapContent = $sitemapContent -replace '<!-- ===== GUIDES =====>', $guideEntry
$sitemapContent | Out-File -FilePath "public/sitemap.xml" -Encoding utf8

Write-Host "✅ All done! Engineering Resources is ready." -ForegroundColor Green
Write-Host "🌐 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run 'npm run dev' and visit /guides" -ForegroundColor White
Write-Host "  2. Use 'new-guide.ps1' to add more articles." -ForegroundColor White
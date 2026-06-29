import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public/guides', `${slug}.md`);

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

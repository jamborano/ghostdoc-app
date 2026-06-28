import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const guidesDirectory = path.join(process.cwd(), 'content/guides');
  
  // Kalau folder gak ada, return array kosong
  if (!fs.existsSync(guidesDirectory)) {
    return NextResponse.json([]);
  }

  const filenames = fs.readdirSync(guidesDirectory);
  const guides = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
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
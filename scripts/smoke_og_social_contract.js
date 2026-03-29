import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = path.resolve(process.cwd());
const indexHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
const privacyHtml = fs.readFileSync(path.join(repoRoot, 'privacy', 'index.html'), 'utf8');
const termsHtml = fs.readFileSync(path.join(repoRoot, 'terms', 'index.html'), 'utf8');

const requiredIndexSnippets = [
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'name="twitter:card"',
  'rel="canonical" href="https://intro-deck.vercel.app/"',
  'href="/favicon.svg"',
  'assets/social/intro-deck-og-1200x630-v1.png'
];

for (const snippet of requiredIndexSnippets) {
  if (!indexHtml.includes(snippet)) {
    throw new Error(`Homepage missing OG/social snippet: ${snippet}`);
  }
}

for (const [name, html, canonical] of [
  ['privacy', privacyHtml, 'https://intro-deck.vercel.app/privacy'],
  ['terms', termsHtml, 'https://intro-deck.vercel.app/terms']
]) {
  if (!html.includes(`rel="canonical" href="${canonical}"`)) {
    throw new Error(`${name} page missing canonical`);
  }
  if (!html.includes('href="/favicon.svg"')) {
    throw new Error(`${name} page missing favicon`);
  }
}

for (const relPath of [
  'assets/social/intro-deck-og-1200x630-v1.png',
  'favicon.svg',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'robots.txt',
  'sitemap.xml',
  'doc/assets/STEP049C_OG_BRIEF.md'
]) {
  if (!fs.existsSync(path.join(repoRoot, relPath))) {
    throw new Error(`Missing OG/social asset: ${relPath}`);
  }
}

console.log('og/social metadata smoke passed');

import { blogPosts, categoryMeta, formatDate } from "@/data/blog";

export const runtime = "nodejs";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title: string, maxChars = 44): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 3);
}

interface OgRouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: OgRouteProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const meta = categoryMeta[post.category];
  const titleLines = wrapTitle(post.title);

  // Layout 1200x630: dark canvas sesuai identitas situs (bukan menyalin Kali).
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="82%" cy="8%" r="60%">
      <stop offset="0%" stop-color="${meta.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${meta.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="#ffffff" opacity="0.06"/>
    </pattern>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${meta.accent}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <rect x="64" y="56" width="72" height="4" rx="2" fill="url(#bar)"/>

  <text x="64" y="104" font-family="monospace, monospace" font-size="24" letter-spacing="6" fill="${meta.accent}" text-transform="uppercase">${escapeXml(meta.label)}</text>

  ${titleLines
    .map((line, i) => {
      const y = 234 + i * 74;
      return `<text x="64" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="56" font-weight="700" fill="#f5f5f5">${escapeXml(line)}</text>`;
    })
    .join("\n  ")}

  <text x="64" y="448" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#a1a1a1">${escapeXml(formatDate(post.date))} · ${escapeXml(post.readingTime)}</text>

  <line x1="64" y1="530" x2="1136" y2="530" stroke="#ffffff" stroke-opacity="0.1"/>

  <text x="64" y="580" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#8a8a8a">rikoardianto.web.id</text>
  <text x="1136" y="580" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="${meta.accent}" text-anchor="end">Blog</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=31536000",
    },
  });
}

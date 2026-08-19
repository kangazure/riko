# Riko Ardianto — Cyber Security Portfolio

Personal portfolio website built with Next.js, deployed via Docker on Dokploy.

**Live:** [rikoardianto.web.id](https://rikoardianto.web.id)

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (Framer Motion)
- **Theme:** next-themes (dark/light mode)
- **Icons:** Lucide React
- **Fonts:** Geist + Geist Mono (next/font)

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Lint & Build

```bash
npm run lint
npm run build
npm start
```

## Docker

### Build & Run Locally

```bash
docker build -t rikoardianto .
docker run -p 3000:3000 rikoardianto
# → http://localhost:3000
```

### Docker Compose

```bash
docker compose up -d
```

## Deploy to Dokploy

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/YOUR_USERNAME/rikoardianto.git
git branch -M main
git push -u origin main
```

### 2. Dokploy Setup

1. Buka **Dokploy Dashboard**
2. Klik **Create Project** → beri nama `rikoardianto`
3. Di dalam project, klik **Create Application**
4. Pilih **Source: GitHub**
5. Connect repository `rikoardianto`
6. Branch: `main`
7. Build method: **Dockerfile**
8. Klik **Deploy**

### 3. Domain & HTTPS

**DNS Setup di penyedia domain:**
```
Type: A
Name: @
Value: IP VPS ANDA
```

```
Type: CNAME
Name: www
Value: rikoardianto.web.id
```

**HTTPS di Dokploy:**
1. Setelah aplikasi jalan, buka tab **Domains**
2. Tambah domain: `rikoardianto.web.id`
3. Centang **Enable HTTPS** / **Let's Encrypt**
4. Dokploy akan otomatis generate SSL certificate

### 4. Environment Variables

Pastikan `.env` atau environment variable di Dokploy terisi:
```env
NEXT_PUBLIC_SITE_URL=https://rikoardianto.web.id
```

## Project Structure

```
rikoardianto/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles + Tailwind
│   ├── about/page.tsx
%   ├── projects/page.tsx
│   ├── skills/page.tsx
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Blog detail (dynamic)
│   ├── contact/page.tsx
│   ├── robots.ts           # SEO robots.txt
│   └── sitemap.ts          # SEO sitemap.xml
├── components/
│   ├── navigation/navbar.tsx
│   ├── hero/
│   │   ├── hero.tsx
│   │   └── rotating-text.tsx
│   ├── sections/
│   │   ├── about-section.tsx
│   │   ├── skills-section.tsx
│   │   ├── contact-section.tsx
│   │   └── footer.tsx
│   ├── blog/blog-section.tsx
│   ├── projects/projects-section.tsx
│   ├── theme/theme-provider.tsx
│   └── motion/
│       ├── parallax-element.tsx
│       └── section-reveal.tsx
├── data/
│   ├── blog.ts             # Blog content
│   ├── projects.ts         # Project data
│   └── skills.ts           # Skills data
├── public/
│   ├── images/
│   └── icons/favicon.svg
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── .gitignore
├── next.config.ts
└── package.json
```

## License

MIT

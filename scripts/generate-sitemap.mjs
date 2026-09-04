import fs from 'node:fs'
import path from 'node:path'

/** Minimal .env.local reader  this script runs outside Vite, so import.meta.env isn't available. */
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return {}
  const env = {}
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

const env = { ...loadEnvLocal(), ...process.env }
const projectId = env.VITE_FIREBASE_PROJECT_ID
const siteUrl = (env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')

async function fetchProjectSlugs() {
  if (!projectId) return []
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/projects?pageSize=300`,
    )
    if (!res.ok) return []
    const data = await res.json()
    const docs = data.documents ?? []
    return docs.map((doc) => doc.name.split('/').pop())
  } catch {
    return []
  }
}

const slugs = await fetchProjectSlugs()
const routes = ['/', ...slugs.map((slug) => `/projects/${slug}`)]

const urlEntries = routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

const robots = `User-agent: *
Allow: /
Disallow: /dash

Sitemap: ${siteUrl}/sitemap.xml
`

fs.writeFileSync(path.resolve(process.cwd(), 'public/sitemap.xml'), sitemap)
fs.writeFileSync(path.resolve(process.cwd(), 'public/robots.txt'), robots)

console.log(`Generated sitemap.xml with ${routes.length} route(s) and robots.txt (site: ${siteUrl})`)

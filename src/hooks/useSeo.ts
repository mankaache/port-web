import { useEffect } from 'react'

interface SeoOptions {
  title: string
  description: string
  /** Absolute URL, or a path under the site's public/ folder (e.g. an uploaded Cloudinary URL, or "/og-default.jpg"). */
  image?: string
  /** Path for the canonical/OG url, e.g. "/projects/some-slug". Defaults to the current location. */
  path?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

function siteUrl() {
  const configured = import.meta.env.VITE_SITE_URL
  const base = configured || window.location.origin
  return base.replace(/\/$/, '')
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Sets document title, meta description/robots, OG/Twitter tags, canonical link, and JSON-LD for the current page. */
export function useSeo({ title, description, image, path, type = 'website', noindex, jsonLd }: SeoOptions) {
  useEffect(() => {
    const base = siteUrl()
    const url = `${base}${path ?? window.location.pathname}`
    const resolvedImage = !image
      ? `${base}/og-default.jpg`
      : image.startsWith('http')
        ? image
        : `${base}${image}`

    document.title = title

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', resolvedImage)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', resolvedImage)

    upsertLink('canonical', url)

    if (jsonLd) {
      let script = document.getElementById('seo-jsonld') as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.id = 'seo-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else {
      document.getElementById('seo-jsonld')?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, path, type, noindex, JSON.stringify(jsonLd)])
}

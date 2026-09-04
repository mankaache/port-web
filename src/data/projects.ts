export type ProjectCategory = 'Build' | 'Maintain' | 'SEO'

export interface ProjectStep {
  title: string
  body: string
}

export interface ProjectResult {
  label: string
  value: string
}

export interface Project {
  slug: string
  title: string
  client: string
  year: string
  tagline: string
  categories: ProjectCategory[]
  stack: string[]
  liveUrl: string
  gradient: [string, string]
  accent: string
  overview: string
  thinking: string
  process: ProjectStep[]
  results: ProjectResult[]
  coverImage?: string
}

/**
 * Fallback content shown when Firestore has no projects yet (or Firebase
 * hasn't been configured). Once real projects are added through /dash,
 * live Firestore data takes over automatically.
 */
export const sampleProjects: Project[] = [
  {
    slug: 'auravest-fintech-rebuild',
    title: 'Auravest',
    client: 'Auravest Capital',
    year: '2025',
    tagline: 'A ground-up rebuild that turned a legacy fintech site into a fast, trustworthy front door.',
    categories: ['Build', 'SEO'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Sanity CMS'],
    liveUrl: 'https://example.com/auravest',
    gradient: ['#a06bff', '#4fe3d0'],
    accent: '#a06bff',
    overview:
      'Auravest came to me with a five-year-old WordPress site that no longer reflected the product or the team behind it. Load times were pushing eight seconds on mobile, the design felt dated next to newer competitors, and organic traffic had been flat for two years. The brief was simple to say and hard to do: rebuild it from scratch, make it fast, and make it feel like a company managing serious money.',
    thinking:
      'I started by mapping every page against actual traffic and conversion data instead of assuming what mattered. Half the site was unused legacy pages from an old product line, so the first win was subtraction cutting the sitemap by 40% before writing a line of code. For the visual direction, I leaned into restrained motion: subtle parallax, numbers that count up on scroll, cards that lift on hover. Nothing flashy enough to undercut trust, but enough to feel alive. Performance was treated as a design constraint from day one, not a cleanup pass at the end.',
    process: [
      {
        title: 'Audit & information architecture',
        body: 'Reviewed analytics, search console data, and stakeholder interviews to rebuild the sitemap around what visitors actually came for.',
      },
      {
        title: 'Design system in code',
        body: 'Built a small, disciplined component library in React and Tailwind so every page shares type scale, spacing, and motion language.',
      },
      {
        title: 'Performance-first build',
        body: 'Static generation for marketing pages, image pipelines tuned for AVIF/WebP, and route-level code splitting to keep the JS budget under control.',
      },
      {
        title: 'Technical SEO pass',
        body: 'Structured data, canonical cleanup, redirect mapping from the old site, and a content refresh on the five highest-intent landing pages.',
      },
    ],
    results: [
      { label: 'Lighthouse performance', value: '97' },
      { label: 'Organic traffic (90 days)', value: '+68%' },
      { label: 'Mobile load time', value: '1.4s' },
    ],
  },
  {
    slug: 'northloop-ecommerce',
    title: 'Northloop',
    client: 'Northloop Outdoor',
    year: '2024',
    tagline: 'A headless storefront built for a seasonal outdoor gear brand with big traffic spikes.',
    categories: ['Build'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Shopify Storefront API', 'Three.js'],
    liveUrl: 'https://example.com/northloop',
    gradient: ['#4fe3d0', '#ffb454'],
    accent: '#4fe3d0',
    overview:
      'Northloop sells camping and hiking gear, with 60% of yearly revenue landing in an eight-week spring window. Their old storefront buckled under launch-day traffic and gave zero room for the kind of product storytelling their gear deserved. They needed a store that could hold up under load and still feel like a design-led brand, not a template.',
    thinking:
      'I decoupled the frontend from Shopify entirely, using it purely as a commerce backend behind the Storefront API. That gave full control over rendering strategy  statically generated category pages that update on a schedule, and a lightweight 3D product viewer for their flagship tent line built with Three.js, so customers could rotate and inspect gear before buying. The interface intentionally slows down in the right places: product pages breathe, but checkout is stripped to the essentials.',
    process: [
      {
        title: 'Headless architecture',
        body: 'Shopify as the commerce engine, a custom React storefront on top, connected through the Storefront API with edge caching for catalog data.',
      },
      {
        title: '3D product exploration',
        body: 'Modeled lightweight GLB previews for the top five SKUs and built an interactive viewer with react-three-fiber, kept under a strict polygon budget for mobile.',
      },
      {
        title: 'Load testing for launch day',
        body: 'Simulated spring-launch traffic patterns and tuned caching, image delivery, and checkout handoff to survive a 12x traffic spike without degrading.',
      },
      {
        title: 'Post-launch iteration',
        body: 'Two weeks of on-call monitoring through the actual seasonal launch, fixing edge cases in real time based on session recordings.',
      },
    ],
    results: [
      { label: 'Peak traffic handled', value: '12x baseline' },
      { label: 'Checkout completion', value: '+21%' },
      { label: 'Avg. session duration', value: '+3m 10s' },
    ],
  },
  {
    slug: 'clearview-dental-seo',
    title: 'Clearview Dental',
    client: 'Clearview Dental Group',
    year: '2024',
    tagline: 'Local SEO and ongoing site care that turned a six-location practice into the top local result.',
    categories: ['SEO', 'Maintain'],
    stack: ['Next.js', 'Tailwind CSS', 'Schema.org', 'Google Business Profile'],
    liveUrl: 'https://example.com/clearview-dental',
    gradient: ['#ff5fb0', '#a06bff'],
    accent: '#ff5fb0',
    overview:
      'Clearview runs six dental practices across one metro area and was invisible in local search outside their oldest location. Their existing site was technically fine but structurally invisible to Google  no location schema, thin location pages, and a Google Business Profile that had not been touched in years.',
    thinking:
      'Local SEO for a multi-location business lives or dies on structure, not tricks. I rebuilt each location as its own properly templated page with LocalBusiness schema, unique content reflecting the actual practitioners and services at that address, and a review-generation workflow the front-desk staff could realistically keep up. Ongoing maintenance mattered as much as the initial push  I stayed on as a monthly retainer to keep the site, plugins, and content current so the SEO gains would compound instead of decaying.',
    process: [
      {
        title: 'Local landscape audit',
        body: 'Mapped competitor rankings across all six service areas and identified which practices were losing visibility to which competitors.',
      },
      {
        title: 'Location page rebuild',
        body: 'Rebuilt each of the six location pages with unique content, structured data, embedded maps, and staff bios rather than duplicated boilerplate.',
      },
      {
        title: 'Review & profile workflow',
        body: 'Set up a lightweight post-visit review request flow and cleaned up all six Google Business Profiles with accurate categories and photos.',
      },
      {
        title: 'Ongoing maintenance retainer',
        body: 'Monthly plugin and security updates, uptime monitoring, and a standing content calendar to keep publishing fresh, locally relevant pages.',
      },
    ],
    results: [
      { label: 'Map pack rankings', value: '5 of 6 in top 3' },
      { label: 'Organic leads / month', value: '+140%' },
      { label: 'Site uptime', value: '99.98%' },
    ],
  },
  {
    slug: 'fernwood-studio-rebrand',
    title: 'Fernwood Studio',
    client: 'Fernwood Architecture',
    year: '2023',
    tagline: 'An editorial, scroll-driven portfolio site for a boutique architecture studio.',
    categories: ['Build'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Cloudinary'],
    liveUrl: 'https://example.com/fernwood-studio',
    gradient: ['#ffb454', '#4fe3d0'],
    accent: '#ffb454',
    overview:
      'Fernwood is a four-person architecture studio whose work is genuinely stunning but was buried in a generic Squarespace template that gave every project the same cramped gallery grid. They wanted a site that felt like walking through their buildings  patient, considered, a little cinematic.',
    thinking:
      'Architecture photography needs room to breathe, so the entire layout is built around full-bleed imagery with typography that gets out of the way. Scroll-triggered transitions reveal each project like a slow reveal rather than a slideshow, timed to feel deliberate rather than gimmicky. I kept the interaction budget small on purpose  a handful of carefully tuned GSAP timelines rather than motion on every element  so the craft of the photography stays the focus.',
    process: [
      {
        title: 'Content-first wireframing',
        body: 'Built layouts directly around the studio\'s best photography rather than fitting photography into a predefined template.',
      },
      {
        title: 'Scroll choreography',
        body: 'Designed and built custom GSAP ScrollTrigger sequences for project reveals, tuned frame-by-frame for pacing.',
      },
      {
        title: 'Asset pipeline',
        body: 'Set up a Cloudinary pipeline for responsive, art-directed image delivery so five-megabyte photography files load in under a second.',
      },
      {
        title: 'CMS handoff',
        body: 'Wired a simple headless CMS so the studio can publish new projects without touching code.',
      },
    ],
    results: [
      { label: 'Avg. time on project page', value: '4m 40s' },
      { label: 'New inquiry rate', value: '+55%' },
      { label: 'Bounce rate', value: '-32%' },
    ],
  },
]

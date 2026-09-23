// Single source of truth for the site's public base URL — used to build
// canonical URLs, hreflang alternates, Open Graph/Twitter metadata,
// `sitemap.ts` and `robots.ts`. Kept as one constant (not a bigger config
// module) because that's the only value shared across those call sites today.
export const BASE_URL = "https://dindin.cafelabs.net";

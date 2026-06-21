import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Replace this fallback with your actual production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exifforge.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

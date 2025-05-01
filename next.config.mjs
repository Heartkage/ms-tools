import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports for GitHub Pages
  // Only use basePath in production
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/ms-tools'
  }),
  images: {
    unoptimized: true
  },
  // Disable server components for static export
  experimental: {
    appDocumentPreloading: false
  }
};

export default withNextIntl(nextConfig); 
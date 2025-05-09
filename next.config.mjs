import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports for GitHub Pages
  // Always use basePath in production
  // basePath: process.env.NODE_ENV === 'production' ? '/ms-tools' : '',
  // Configure asset prefix for production
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/ms-tools' : '',
  images: {
    unoptimized: true
  },
  // Disable server components for static export
  experimental: {
    appDocumentPreloading: false
  }
};

export default withNextIntl(nextConfig); 
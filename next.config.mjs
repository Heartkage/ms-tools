/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static exports for GitHub Pages
  // Only use basePath in production
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/ms-tools'
  })
};

export default nextConfig; 
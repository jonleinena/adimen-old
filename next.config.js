const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin(
    './src/app/i18n.ts'
  );
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.google.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com'
    ],
  },
};
 
module.exports = withNextIntl(nextConfig);
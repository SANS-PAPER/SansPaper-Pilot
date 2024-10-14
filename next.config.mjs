/** @type {import('next').NextConfig} */

import dotenv from 'dotenv';

dotenv.config();

export default {
  images: {
    domains: ['lh3.googleusercontent.com', 's.gravatar.com', 'cdn.auth0.com', 'static.vecteezy.com', 'icons.iconarchive.com', 'media.licdn.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.auth0.com',
        port: '',
        pathname: '/avatars/**',
      },
    ],
  },
   
  };
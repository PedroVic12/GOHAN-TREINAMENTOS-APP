import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@opentelemetry/exporter-jaeger');
      // You might need to add other OpenTelemetry related packages here if the issue persists
      // config.externals.push('@opentelemetry/sdk-node');
      // config.externals.push('@opentelemetry/api');
    }
    return config;
  },
};

export default nextConfig;

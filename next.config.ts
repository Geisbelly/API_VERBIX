/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  
  reactStrictMode: true, // Habilita o modo estrito para identificar problemas no React
  env: {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_SERVER: process.env.DB_SERVER,
    DB_DATABASE: process.env.DB_DATABASE,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Certifique-se de que o domínio está correto (inclua o protocolo 'https://')
          { key: 'Access-Control-Allow-Methods', value: 'GET , POST , PUT , DELETE , OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
    ];
  },
  async redirects() {
    return [

    ]
  },
  trailingSlash: true,

};



export default nextConfig; // Exportação correta para Next.js 13+

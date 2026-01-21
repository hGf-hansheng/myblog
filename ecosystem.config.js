module.exports = {
  apps: [
    {
      name: 'my-blog',
      script: 'server.js',
      cwd: './.next/standalone', // Start from the standalone build directory
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0', // Important for accessing from outside localhost
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: 'clawmart-cn-backend',
      script: 'php8.4',
      args: 'artisan serve --host=127.0.0.1 --port=8072',
      cwd: '/home/ubuntu/clawmart-cn/backend',
      interpreter: 'none',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        APP_ENV: 'production',
      },
    },
    {
      name: 'clawmart-cn-frontend',
      script: 'npm',
      args: 'start -- -p 3113 -H 127.0.0.1',
      cwd: '/home/ubuntu/clawmart-cn/frontend',
      interpreter: 'none',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};

module.exports = {
  apps : [{
    name: 'cashcog-backend-services',
    script: './src/app.js',
    autorestart: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      MONGO_URL : ' ', // Fill this with your mongo connection string
      PORT : 5000
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    {
      name: "doc.yourname.com",
      script: "bin/www",
      instances: 0,
      exec_mode: "cluster",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      autorestart: true,
      log_file: "./logs/combined.outerr.log",
      out_file: "./logs/out.log",
      error_file: "./logs/err.log",
      env: {
        COMMON_VARIABLE: "true",
        NODE_ENV: "production",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
  ],
}

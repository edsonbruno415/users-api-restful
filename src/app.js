const { config } = require('dotenv');
const path = require('path');
const assert = require('assert');

const env = process.env.NODE_ENV || 'dev';

assert.ok(env === 'prod' || env === 'dev', 'A env é inválida, ou é dev ou prod');

const configPath = path.join(__dirname, '..', './config', `.env.${env}`);

config({
  path: configPath,
});

const Hapi = require('@hapi/hapi');
const routes = require('./routes/routes');

async function main() {
  const app = Hapi.server({
    port: process.env.PORT,
  });

  app.route(routes());

  await app.start();

  return app;
}

main();

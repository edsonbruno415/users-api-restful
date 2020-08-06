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
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const { request } = require('http');
const Context = require('./models/context/context');
const MongoStrategy = require('./models/mongoStrategy/mongoStrategy');
const userSchema = require('./models/schemas/userSchema');
const routes = require('./routes/routes');

async function main() {
  const connection = MongoStrategy.connect();
  const users = new Context(new MongoStrategy(connection, userSchema));

  const app = Hapi.server({
    port: process.env.PORT,
  });

  const swaggerOptions = {
    info: {
      title: 'API Users - Autorização e Autenticação',
      version: 'v1.0',
      description: 'API de usuários com autenticação com login/senha e autorização com JWT.',
    },
  };

  await app.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  const authUserSearch = {
    name: 'authUserSearch',
    version: '1.0.0',
    async register(server, options) {
      server.route({
        method: 'POST',
        path: '/user_search/',
        handler: (request, h) => {
          console.log('Hello');
          h.continue;
        },
      });
    },
  };

  await app.register({
    plugin: authUserSearch,
  });

  app.route(routes(users));

  await app.start();

  return app;
}

main();

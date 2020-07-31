const Hapi = require('@hapi/hapi');

async function main() {
  const app = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  /* app.route([
    {
      method: 'POST',
      path: '/sign_up',
      handler: (request, headers) => {
      },
    },
    {
      method: 'POST',
      path: 'sign_in',
      handler: () => {

      },
    },
  ]); */

  await app.start();
  // const { port, host, protocol } = app.info;
  // console.log(`Application is running on ${protocol}://${host}:${port}`);
  return app;
}

main();

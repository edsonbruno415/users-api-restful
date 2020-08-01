const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const Context = require('./models/context/context');
const MongoStrategy = require('./models/mongoStrategy/mongoStrategy');
const userSchema = require('./models/schemas/userSchema');
const jwt = require('./util/jwt');
const hashPassword = require('./util/hashPassword');
const DateToString = require('./util/dateToString');

async function main() {
  const connection = MongoStrategy.connect();
  const users = new Context(new MongoStrategy(connection, userSchema));

  const app = Hapi.server({
    port: 3333,
    host: 'localhost',
  });

  app.route([
    {
      method: 'POST',
      path: '/sign_up',
      options: {
        validate: {
          payload: Joi.object({
            nome: Joi.string().min(3).max(45).required(),
            email: Joi.string().min(3).required(),
            senha: Joi.string().min(6).required(),
            telefones: Joi.array().items(
              Joi.object({
                numero: Joi.string().pattern(/\d{8,9}/).max(9).required(),
                ddd: Joi.string().pattern(/\d{2}/).max(2).required(),
              }),
            ),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const user = request.payload;

          const [userDB] = await users.read({ email: user.email });

          if (userDB) {
            return h.response({
              mensagem: 'E-mail ja existente!',
            }).code(409);
          }

          const newUser = {
            id: '',
            ...user,
            senha: await hashPassword.createHash(user.senha),
            data_criacao: DateToString(new Date()),
            data_atualizacao: DateToString(new Date()),
            ultimo_login: DateToString(new Date()),
            token: await jwt.getToken({
              nome: user.nome,
              email: user.email,
            }),
          };

          const { id } = await users.create(newUser);

          newUser.id = id;
          return h.response(newUser).code(201);
        } catch (err) {
          return h.response({
            mensagem: err.message,
          });
        }
      },
    },
    {
      method: 'POST',
      path: '/sign_in',
      options: {
        validate: {
          payload: Joi.object({
            email: Joi.string().min(3).required(),
            senha: Joi.string().min(6).required(),
          }),
        },
      },
      handler: async (request, h) => {
        try {
          const user = request.payload;

          const [userDB] = await users.read({ email: user.email });

          if (!userDB) {
            return h.response({
              mensagem: 'Usuário e/ou senha inválidos!',
            }).code(401);
          }

          const isEqual = await hashPassword.compare(user.senha, userDB.senha);

          if (!isEqual) {
            return h.response({
              mensagem: 'Usuário e/ou senha inválidos!',
            }).code(401);
          }

          const userStr = JSON.stringify(userDB);
          const json = JSON.parse(userStr);

          const telefones = json.telefones.map((tel) => ({ numero: tel.numero, ddd: tel.ddd }));

          const userJSON = {
            id: json._id,
            ...json,
            telefones,
          };
          delete userJSON._id;
          delete userJSON.__v;

          return userJSON;
        } catch (err) {
          return h.response({
            mensagem: err.message,
          });
        }
      },
    },
    {
      method: 'POST',
      path: '/search_user/{user_id}',
      options: {
        validate: {
          headers: Joi.object({
            authentication: Joi.string().required(),
          }),
          options: {
            allowUnknown: true,
          },
        },
      },
      handler: async (request, h) => {
        try {
          const { authentication } = request.headers;
          const userId = request.params.user_id;

          if (!authentication) {
            return h.response({
              mensagem: 'Não autorizado!',
            }).code(401);
          }

          const token = authentication.toString().split(' ').pop();

          const result = await jwt.verifyToken(token);

          const [userDB] = await users.read({ email: result.email });

          if (userDB.token !== token) {
            return h.response({
              mensagem: 'Não autorizado!',
            }).code(401);
          }

          const [query] = await users.read({ _id: userId });

          return query;
        } catch (err) {
          return h.response({
            mensagem: err.message,
          });
        }
      },
    },
    {
      method: '*',
      path: '/{any*}',
      handler: (request, h) => (h.response({
        mensagem: 'Não encontrado!',
      }).code(404)),
    },
  ]);

  await app.start();

  return app;
}

main();

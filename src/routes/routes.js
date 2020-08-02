const Joi = require('@hapi/joi');

function Routes(users) {
  const SignIn = require('../controllers/signIn')(users);
  const SignUp = require('../controllers/signUp')(users);
  const SearchUser = require('../controllers/searchUser')(users);

  function signUp() {
    return {
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
      handler: SignUp.post,
    };
  }

  function signIn() {
    return {
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
      handler: SignIn.post,
    };
  }

  function searchUser() {
    return {
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
      handler: SearchUser.post,
    };
  }

  function anyRoute() {
    return {
      method: '*',
      path: '/{any*}',
      handler: (request, h) => (h.response({
        mensagem: 'Não encontrado!',
      }).code(404)),
    };
  }

  return [
    signUp(),
    signIn(),
    searchUser(),
    anyRoute(),
  ];
}

module.exports = Routes;

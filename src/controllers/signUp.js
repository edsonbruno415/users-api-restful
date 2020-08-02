const jwt = require('../util/jwt');
const hashPassword = require('../util/hashPassword');

function signUp(users) {
  async function post(request, h) {
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
        data_criacao: new Date(),
        data_atualizacao: new Date(),
        ultimo_login: new Date(),
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
  }

  return {
    post,
  };
}

module.exports = signUp;

const hashPassword = require('../util/hashPassword');

function signIn(users) {
  async function post(request, h) {
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

      const {
        id,
        nome,
        email,
        senha,
        telefones,
        data_criacao,
        data_atualizacao,
        ultimo_login,
        token,
      } = userDB;

      const telefonesWithoutId = telefones.map((tel) => ({
        numero: tel.numero,
        ddd: tel.ddd,
      }));

      await users.update({ _id: id }, {
        ultimo_login: new Date(),
      });

      const userJSON = {
        id,
        nome,
        email,
        senha,
        telefones: telefonesWithoutId,
        data_criacao,
        data_atualizacao,
        ultimo_login,
        token,
      };

      return userJSON;
    } catch (err) {
      return h.response({
        mensagem: err.message,
      }).code(500);
    }
  }

  return {
    post,
  };
}

module.exports = signIn;

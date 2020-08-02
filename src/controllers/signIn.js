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

      await users.update({ _id: userDB._id }, {
        ultimo_login: new Date(),
      });

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
  }

  return {
    post,
  };
}

module.exports = signIn;

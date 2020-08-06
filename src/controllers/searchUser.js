const TIME_BETWEEN_SESSIONS = process.env.TIME_SESSION;

function searchUser(users) {
  async function post(request, h) {
    try {
      const { authentication } = request.headers;
      const userId = request.params.user_id;

      if (!authentication) {
        return h.response({
          mensagem: 'Não autorizado!',
        }).code(401);
      }

      const tokenHeaders = authentication.toString().split(' ').pop();

      const [userDB] = await users.read({ _id: userId });

      if (userDB.token !== tokenHeaders) {
        return h.response({
          mensagem: 'Não autorizado!',
        }).code(401);
      }

      const ultimaVezLogado = new Date(userDB.ultimo_login).getTime();
      const dataAgora = new Date().getTime();
      const diferencaTempo = dataAgora - ultimaVezLogado;

      const tempoLimite = TIME_BETWEEN_SESSIONS;

      if (diferencaTempo < tempoLimite) {
        return h.response({
          mensagem: 'Sessão Inválida!',
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

      await users.update({ _id: id }, {
        ultimo_login: new Date(),
      });

      const telefonesWithoutId = telefones.map((tel) => ({ 
        numero: tel.numero,
        ddd: tel.ddd,
      }));

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

module.exports = searchUser;

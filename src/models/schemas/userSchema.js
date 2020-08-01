const mongoose = require('mongoose');

const telefones = mongoose.Schema({
  ddd: {
    type: String,
  },
  numero: {
    type: String,
  },
});

const userSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  telefones: [telefones],
  data_criacao: String,
  data_atualizacao: String,
  ultimo_login: String,
  token: String,
});

const user = mongoose.model('User', userSchema);

module.exports = user;

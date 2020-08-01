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
  data_criacao: Date,
  data_atualizacao: Date,
  ultimo_login: Date,
  token: String,
});

const user = mongoose.model('User', userSchema);

module.exports = user;

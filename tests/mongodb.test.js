const Context = require('../src/models/context/context');
const MongoStrategy = require('../src/models/mongoStrategy/mongoStrategy');
const UserSchema = require('../src/models/schemas/user');
const assert = require('assert');

let data = new Date();
let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
let DateString = data.toLocaleDateString('pt-BR', options);

MOCK_USER_CADASTRAR = {
  nome: 'Bruno Ramalho',
  email: 'bruno4586@gmail.com',
  senha: '545781231',
  telefones: [{
    numero: '457892223',
    ddd: '11'
  }, {
    numero: '99999999',
    ddd: '11'
  }],
  data_criacao: DateString,
  data_atualizacao: DateString,
  ultimo_login: DateString,
  token: 'SDhjs454481^#$44111'
}

let context = {};
describe('Testes com MongoDB', function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    const connection = MongoStrategy.connect();
    context = new Context(new MongoStrategy(connection, UserSchema));
  });
  it.only('Cadastrar um novo usuario', async () => {
    const result = await context.create(MOCK_USER_CADASTRAR);

    const user = result;
    
    assert.deepEqual(user,MOCK_USER_CADASTRAR);
  });
});

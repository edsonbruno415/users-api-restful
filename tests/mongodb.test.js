const Context = require('../src/models/context/context');
const MongoStrategy = require('../src/models/mongoStrategy/mongoStrategy');
const UserSchema = require('../src/models/schemas/user');
const assert = require('assert');
const DateToString = require('../src/util/dateToString');

const MOCK_USER_CADASTRAR = {
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
  data_criacao: DateToString(new Date()),
  data_atualizacao: DateToString(new Date()),
  ultimo_login: DateToString(new Date()),
  token: 'SDhjs454481^#$44111'
}
const MOCK_USER_ATUALIZAR = {
  nome: 'Edson Sobrinho',
  email: 'ebsobrinho@gmail.com'
}

let MOCK_ID_CADASTRADO = '';

let context = {};
describe('Testes com MongoDB', function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    const connection = MongoStrategy.connect();
    context = new Context(new MongoStrategy(connection, UserSchema));
  });
  it('Cadastrar um novo usuario', async () => {
    const result = await context.create(MOCK_USER_CADASTRAR);
    MOCK_ID_CADASTRADO = result._id;

    const user = {
      nome: result.nome,
      email: result.email,
      senha: result.senha,
      token: result.token,
    }

    const mock_user = {
      nome: MOCK_USER_CADASTRAR.nome,
      email: MOCK_USER_CADASTRAR.email,
      senha: MOCK_USER_CADASTRAR.senha,
      token: MOCK_USER_CADASTRAR.token,
    }

    assert.deepEqual(user, mock_user);
  });

  it('Consultar o usuario cadastrado', async () => {
    const [result] = await context.read({ nome: MOCK_USER_CADASTRAR.nome });

    const usuario = {
      nome: result.nome,
      email: result.email,
    }

    const mock_usuario = {
      nome: MOCK_USER_CADASTRAR.nome,
      email: MOCK_USER_CADASTRAR.email,
    }

    assert.deepEqual(usuario, mock_usuario);
  });

  it('Atualizar o usuario cadastrado', async () => {
    const result = await context.update(MOCK_ID_CADASTRADO, MOCK_USER_ATUALIZAR);

    const { nModified, ok } = result;

    assert.ok(ok === 1);
    assert.ok(nModified === 1);
  });

  it('Remover um usuario', async () => {
    const result = await context.delete({ _id: MOCK_ID_CADASTRADO });

    const { deletedCount, ok } = result;

    assert.ok(ok === 1);
    assert.ok(deletedCount === 1);
  });
});

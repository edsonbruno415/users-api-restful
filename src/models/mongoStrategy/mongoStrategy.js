const Mongoose = require('mongoose');
const IContext = require('../context/Icontext/Icontext');

const uri = 'mongodb://edsonbruno:api3007@localhost:27017/users';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

class MongoStrategy extends IContext {
  constructor(connection, schema) {
    super();
    this.connection = connection;
    this.schema = schema;
  }

  static connect() {
    Mongoose.connect(uri, options, (error) => {
      if (error) {
        throw Error('Connection Failed!');
      }
    });
    const { connection } = Mongoose;
    return connection;
  }

  async create(user) {
    const newUser = await this.schema.create(user);
    return newUser;
  }

  read() {
    return this.schema.find();
  }
}

module.exports = MongoStrategy;

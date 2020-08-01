const Mongoose = require('mongoose');
const IContext = require('../context/Icontext/Icontext');

const uri = process.env.MONGO_URL;
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

  async create(item) {
    const newUser = await this.schema.create(item);
    return newUser;
  }

  read(item, skip = 0, limit = 10) {
    return this.schema.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this.schema.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this.schema.deleteOne({ _id: id });
  }
}

module.exports = MongoStrategy;

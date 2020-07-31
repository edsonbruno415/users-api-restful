const IContext = require('./Icontext/Icontext');

class Context extends IContext {
  constructor(db) {
    super();
    this.db = db;
  }

  create(item) {
    return this.db.create(item);
  }

  read(id) {
    return this.db.read(id);
  }

  update(id, item) {
    return this.db.update(id, item);
  }

  delete(id) {
    return this.db.delete(id);
  }
}

module.exports = Context;

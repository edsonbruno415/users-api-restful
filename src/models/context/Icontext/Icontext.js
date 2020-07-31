const NotImplementedException = require('./errors/notImplementedException');

class IContext {
  create() {
    throw new NotImplementedException();
  }

  read() {
    throw new NotImplementedException();
  }

  update() {
    throw new NotImplementedException();
  }

  delete() {
    throw new NotImplementedException();
  }
}

module.exports = IContext;

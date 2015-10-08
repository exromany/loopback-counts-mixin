module.exports = function mixin (app) {
  app.loopback.modelBuilder.mixins.define('Counts', require('./counts'));
};

module.exports = function Counts (Model) {
  'use strict';
  var Promise = require('es6-promise').Promise;
  Model.afterRemote('findById', injectCounts);
  Model.afterRemote('findOne', injectCounts);
  Model.afterRemote('find', injectCounts);

  function injectCounts (ctx, unused, next) {
    var resources = ctx.result;
    if (resources == null) return next();
    
    var relations = extractRelationCounts(ctx);
    if (!Array.isArray(resources)) resources = [resources];
    if (!relations.length || !resources.length) {
      return next();
    }

    fillCounts(relations, resources).then(function () {
      return next();
    }, function () {
      return next();
    });
  }

  function extractRelationCounts (ctx) {
    var filter;
    if (!ctx.args || !ctx.args.filter) return [];
    if (typeof ctx.args.filter === 'string') {
      filter = JSON.parse(ctx.args.filter);
    } else {
      filter = ctx.args.filter;
    }
    var relations = filter && filter.counts;
    if (!Array.isArray(relations)) relations = [relations];
    return relations.filter(function (relation) {
      return Model.relations[relation] && (Model.relations[relation].type.indexOf('has') === 0);
    });
  }

  function fillCounts (relations, resources) {
    return Promise.all(resources.map(function (resource) {
      return Promise.all(relations.map(function (relation) {
        return resource[relation].count().then(function (count) {
          resource[relation + 'Count'] = count;
        });
      }));
    }));
  }
};

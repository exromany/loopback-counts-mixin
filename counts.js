var qs = require('qs');

module.exports = function Counts (Model) {
  'use strict';

  Model.afterRemote('findById', injectCounts);
  Model.afterRemote('findOne', injectCounts);
  Model.afterRemote('find', injectCounts);

  function injectCounts (ctx, unused, next) {
    var relations = extractRelationCounts(ctx);
    var resources = ctx.result;
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
    if (!ctx.args || !ctx.args.filter) return [];

    var relations;
    var filter;

    try{
        filter = JSON.parse(ctx.args.filter);
    }catch(e){
        filter = qs.parse(ctx.args.filter);
    }

    relations = filter && filter.counts;

    if (!Array.isArray(relations)) relations = [relations];
    return relations.filter(function (relation) {
      return Model.relations[relation] && Model.relations[relation].type.startsWith('has');
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

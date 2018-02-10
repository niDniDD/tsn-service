'use strict';

/**
 * Module dependencies
 */
var homesPolicy = require('../policies/homes.server.policy'),
  homes = require('../controllers/homes.server.controller');

module.exports = function (app) {
  // Homes Routes
  app.route('/api/homes').all(homesPolicy.isAllowed)
    .get(homes.news, homes.download, homes.team, homes.list);
};

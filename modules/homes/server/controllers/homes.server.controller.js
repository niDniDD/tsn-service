'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  cloudinary = require(path.resolve('./config/lib/cloudinary')).cloudinary,
  Download = mongoose.model('Download'),
  News = mongoose.model('News'),
  Team = mongoose.model('Team'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * List of Homes
 */
exports.news = function (req, res, next) {
  News.find().sort('-created').populate('user', 'displayName').limit(3).exec(function (err, news) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.news = news;
      next();
    }
  });
};

exports.download = function (req, res, next) {
  Download.find().sort('-created').populate('user', 'displayName').exec(function (err, downloads) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.downloads = downloads;
      next();
    }
  });
};

exports.team = function (req, res, next) {
  Team.find().sort('-created').populate('user', 'displayName').exec(function (err, teams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.teams = teams;
      next();
    }
  });
};

exports.list = function (req, res) {
  res.jsonp({
    news: req.news,
    teams: req.teams,
    downloads: req.downloads
  });
};

exports.uploadImage = function (req, res) {
  var message = null;
  var cloudImageURL = req.body.data;
  // console.log(cloudImageURL);
  cloudinary.uploader.upload(cloudImageURL, function (result) {
    var imageURL = result.url;
    res.json({
      status: '000',
      message: 'success',
      imageURL: imageURL
    });
  });
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
  nickname: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  image: {
    type: String
  },
  tel: {
    type: String
  },
  email: {
    type: String
  },
  line: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Team', TeamSchema);

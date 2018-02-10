'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Download = mongoose.model('Download'),
  News = mongoose.model('News'),
  Team = mongoose.model('Team'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  download,
  news,
  team,
  home;

/**
 * Home routes tests
 */
describe('Home CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    download = new Download({
      title: 'sdfsf',
      url: 'url',
      user: user
    });

    news = new News({
      name: 'name',
      detail: 'detail',
      image: 'url',
      user: user
    });

    team = new Team({
      nickname: 'nickname',
      firstname: 'firstname',
      lastname: 'lastname',
      image: 'image',
      tel: 'tel',
      email: 'email',
      line: 'line',
      user: user
    });
    // Save a user to the test db and create new Home
    user.save(function () {
      // download.save(function () {
      //   news.save(function () {
      //     team.save(function () {
      done();
      //     });
      //   });
      // });
    });
  });

  it('should be able to save a Home if logged in', function (done) {
    download.save();
    news.save();
    team.save();
    agent.get('/api/homes')
      .end(function (homesGetErr, homesGetRes) {
        // Handle Homes save error
        if (homesGetErr) {
          return done(homesGetErr);
        }

        // Get Homes list
        var homes = homesGetRes.body;

        // Set assertions
        // (homes).should.equal('ok');
        (homes.downloads.length).should.equal(1);
        (homes.news.length).should.equal(1);
        (homes.teams.length).should.equal(1);

        // Call the assertion callback
        done();
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Download.remove().exec(function () {
        News.remove().exec(function () {
          Team.remove().exec(done);
        });
      });
    });
  });
});

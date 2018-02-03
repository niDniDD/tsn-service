'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Download = mongoose.model('Download'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  download;

/**
 * Download routes tests
 */
describe('Download CRUD tests', function () {

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

    // Save a user to the test db and create new Download
    user.save(function () {
      download = {
        name: 'Download name'
      };

      done();
    });
  });

  it('should be able to save a Download if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Download
        agent.post('/api/downloads')
          .send(download)
          .expect(200)
          .end(function (downloadSaveErr, downloadSaveRes) {
            // Handle Download save error
            if (downloadSaveErr) {
              return done(downloadSaveErr);
            }

            // Get a list of Downloads
            agent.get('/api/downloads')
              .end(function (downloadsGetErr, downloadsGetRes) {
                // Handle Downloads save error
                if (downloadsGetErr) {
                  return done(downloadsGetErr);
                }

                // Get Downloads list
                var downloads = downloadsGetRes.body;

                // Set assertions
                (downloads[0].user._id).should.equal(userId);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Download if not logged in', function (done) {
    agent.post('/api/downloads')
      .send(download)
      .expect(403)
      .end(function (downloadSaveErr, downloadSaveRes) {
        // Call the assertion callback
        done(downloadSaveErr);
      });
  });

  it('should return proper error for single Download with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/downloads/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Download is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Download which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Download
    request(app).get('/api/downloads/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Download with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Download if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Download
        agent.post('/api/downloads')
          .send(download)
          .expect(200)
          .end(function (downloadSaveErr, downloadSaveRes) {
            // Handle Download save error
            if (downloadSaveErr) {
              return done(downloadSaveErr);
            }

            // Delete an existing Download
            agent.delete('/api/downloads/' + downloadSaveRes.body._id)
              .send(download)
              .expect(200)
              .end(function (downloadDeleteErr, downloadDeleteRes) {
                // Handle download error error
                if (downloadDeleteErr) {
                  return done(downloadDeleteErr);
                }

                // Set assertions
                (downloadDeleteRes.body._id).should.equal(downloadSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Download if not signed in', function (done) {
    // Set Download user
    download.user = user;

    // Create new Download model instance
    var downloadObj = new Download(download);

    // Save the Download
    downloadObj.save(function () {
      // Try deleting Download
      request(app).delete('/api/downloads/' + downloadObj._id)
        .expect(403)
        .end(function (downloadDeleteErr, downloadDeleteRes) {
          // Set message assertion
          (downloadDeleteRes.body.message).should.match('User is not authorized');

          // Handle Download error error
          done(downloadDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Download.remove().exec(done);
    });
  });
});

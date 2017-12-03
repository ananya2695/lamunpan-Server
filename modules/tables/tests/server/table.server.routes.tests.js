'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Table = mongoose.model('Table'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  table;

/**
 * Table routes tests
 */
describe('Table CRUD tests', function () {

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

    // Save a user to the test db and create new Table
    user.save(function () {
      table = {
        name: 'Table name'
      };

      done();
    });
  });

  it('should be able to save a Table if logged in', function (done) {
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

        // Save a new Table
        agent.post('/api/tables')
          .send(table)
          .expect(200)
          .end(function (tableSaveErr, tableSaveRes) {
            // Handle Table save error
            if (tableSaveErr) {
              return done(tableSaveErr);
            }

            // Get a list of Tables
            agent.get('/api/tables')
              .end(function (tablesGetErr, tablesGetRes) {
                // Handle Tables save error
                if (tablesGetErr) {
                  return done(tablesGetErr);
                }

                // Get Tables list
                var tables = tablesGetRes.body;

                // Set assertions
                (tables[0].user._id).should.equal(userId);
                (tables[0].name).should.match('Table name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Table if not logged in', function (done) {
    agent.post('/api/tables')
      .send(table)
      .expect(403)
      .end(function (tableSaveErr, tableSaveRes) {
        // Call the assertion callback
        done(tableSaveErr);
      });
  });

  it('should not be able to save an Table if no name is provided', function (done) {
    // Invalidate name field
    table.name = '';

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

        // Save a new Table
        agent.post('/api/tables')
          .send(table)
          .expect(400)
          .end(function (tableSaveErr, tableSaveRes) {
            // Set message assertion
            (tableSaveRes.body.message).should.match('Please fill Table name');

            // Handle Table save error
            done(tableSaveErr);
          });
      });
  });

  it('should be able to update an Table if signed in', function (done) {
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

        // Save a new Table
        agent.post('/api/tables')
          .send(table)
          .expect(200)
          .end(function (tableSaveErr, tableSaveRes) {
            // Handle Table save error
            if (tableSaveErr) {
              return done(tableSaveErr);
            }

            // Update Table name
            table.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Table
            agent.put('/api/tables/' + tableSaveRes.body._id)
              .send(table)
              .expect(200)
              .end(function (tableUpdateErr, tableUpdateRes) {
                // Handle Table update error
                if (tableUpdateErr) {
                  return done(tableUpdateErr);
                }

                // Set assertions
                (tableUpdateRes.body._id).should.equal(tableSaveRes.body._id);
                (tableUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tables if not signed in', function (done) {
    // Create new Table model instance
    var tableObj = new Table(table);

    // Save the table
    tableObj.save(function () {
      // Request Tables
      request(app).get('/api/tables')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Table if not signed in', function (done) {
    // Create new Table model instance
    var tableObj = new Table(table);

    // Save the Table
    tableObj.save(function () {
      request(app).get('/api/tables/' + tableObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', table.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Table with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tables/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Table is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Table which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Table
    request(app).get('/api/tables/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Table with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Table if signed in', function (done) {
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

        // Save a new Table
        agent.post('/api/tables')
          .send(table)
          .expect(200)
          .end(function (tableSaveErr, tableSaveRes) {
            // Handle Table save error
            if (tableSaveErr) {
              return done(tableSaveErr);
            }

            // Delete an existing Table
            agent.delete('/api/tables/' + tableSaveRes.body._id)
              .send(table)
              .expect(200)
              .end(function (tableDeleteErr, tableDeleteRes) {
                // Handle table error error
                if (tableDeleteErr) {
                  return done(tableDeleteErr);
                }

                // Set assertions
                (tableDeleteRes.body._id).should.equal(tableSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Table if not signed in', function (done) {
    // Set Table user
    table.user = user;

    // Create new Table model instance
    var tableObj = new Table(table);

    // Save the Table
    tableObj.save(function () {
      // Try deleting Table
      request(app).delete('/api/tables/' + tableObj._id)
        .expect(403)
        .end(function (tableDeleteErr, tableDeleteRes) {
          // Set message assertion
          (tableDeleteRes.body.message).should.match('User is not authorized');

          // Handle Table error error
          done(tableDeleteErr);
        });

    });
  });

  it('should be able to get a single Table that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Table
          agent.post('/api/tables')
            .send(table)
            .expect(200)
            .end(function (tableSaveErr, tableSaveRes) {
              // Handle Table save error
              if (tableSaveErr) {
                return done(tableSaveErr);
              }

              // Set assertions on new Table
              (tableSaveRes.body.name).should.equal(table.name);
              should.exist(tableSaveRes.body.user);
              should.equal(tableSaveRes.body.user._id, orphanId);

              // force the Table to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Table
                    agent.get('/api/tables/' + tableSaveRes.body._id)
                      .expect(200)
                      .end(function (tableInfoErr, tableInfoRes) {
                        // Handle Table error
                        if (tableInfoErr) {
                          return done(tableInfoErr);
                        }

                        // Set assertions
                        (tableInfoRes.body._id).should.equal(tableSaveRes.body._id);
                        (tableInfoRes.body.name).should.equal(table.name);
                        should.equal(tableInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Table.remove().exec(done);
    });
  });
});

'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product'),
  Category = mongoose.model('Category'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  category,
  product;

/**
 * Product routes tests
 */
describe('Product CRUD tests not login', function () {

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

    category = new Category({
      name: 'Category name',
      pic: 'http://www.fusioncaffe.com/wp-content/uploads/2014/04/Caff%C3%A8-Americano.jpg',
      user: user
    });

    // Save a user to the test db and create new Product
    user.save(function () {
      category.save(function () {
        product = {
          name: 'Product name',
          detail: 'Product detail',
          size: [{
            size: 's',
            price: 20
          }],
          type: [{
            name: 'hot',
            price: 10
          }],
          pic: 'http://www.fusioncaffe.com/wp-content/uploads/2014/04/Caff%C3%A8-Americano.jpg',
          category: category,
          user: user
        };

        done();
      });

    });
  });


  it('get product', function (done) {
    agent.post('/api/products')
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        // Get a list of Products
        agent.get('/api/products')
          .end(function (productsGetErr, productsGetRes) {
            // Handle Products save error
            if (productsGetErr) {
              return done(productsGetErr);
            }

            // Get Products list
            var products = productsGetRes.body;

            // Set assertions
            // (products[0].user._id).should.equal(userId);
            (products[0].name).should.match('Product name');
            (products[0].detail).should.match('Product detail');
            (products[0].pic).should.match('http://www.fusioncaffe.com/wp-content/uploads/2014/04/Caff%C3%A8-Americano.jpg');
            (products[0].size[0].size).should.match('s');
            (products[0].size[0].price).should.match(20);
            (products[0].type[0].name).should.match('hot');
            (products[0].type[0].price).should.match(10);
            (products[0].category.name).should.match(category.name);
            (products[0].category.pic).should.match(category.pic);




            // Call the assertion callback
            done();
          });
      });
  });

  it('save product', function (done) {
    // Save a new Product
    agent.post('/api/products')
      .send(product)
      .expect(200)
      .end(function (productSaveErr, productSaveRes) {
        // Handle Product save error
        if (productSaveErr) {
          return done(productSaveErr);
        }

        // Get a list of Products
        agent.get('/api/products')
          .end(function (productsGetErr, productsGetRes) {
            // Handle Products save error
            if (productsGetErr) {
              return done(productsGetErr);
            }

            // Get Products list
            var products = productsGetRes.body;

            // Set assertions
            //(products[0].user.loginToken).should.equal(token);
            (products[0].name).should.match('Product name');
            (products[0].detail).should.match('Product detail');
            (products[0].pic).should.match('http://www.fusioncaffe.com/wp-content/uploads/2014/04/Caff%C3%A8-Americano.jpg');
            (products[0].size[0].size).should.match('s');
            (products[0].size[0].price).should.match(20);
            (products[0].type[0].name).should.match('hot');
            (products[0].type[0].price).should.match(10);
            (products[0].category.name).should.match(category.name);
            (products[0].category.pic).should.match(category.pic);

            // Call the assertion callback
            done();
          });
      });
  });


  afterEach(function (done) {
    User.remove().exec(function () {
      Category.remove().exec(function () {
        Product.remove().exec(done);
      });
    });
  });
});

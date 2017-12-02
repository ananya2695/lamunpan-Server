'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Product = mongoose.model('Product');

/**
 * Globals
 */
var user,
  product;

/**
 * Unit tests
 */
describe('Product Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      product = new Product({
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
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return product.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      product.name = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Product.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});

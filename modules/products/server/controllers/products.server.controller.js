'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Product
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function (req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function (req, res) {
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function (req, res) {
  Product.find().sort('-created').populate('user', 'displayName').populate('category').exec(function (err, products) {
    // console.log(products);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(products);
    }
  });
};

/**
 * Product middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};

exports.getProductByCate = function (req, res) {
  res.jsonp({
    products: [{
        category: 'coffee',
        name: 'americano',
        detail: 'กาแฟอเมริกาโน่แท้',
        size: [{
          size: 's',
          price: 20
        }],
        type: [{
            name: 'hot',
            price: 10
          },
          {
            name: 'cold',
            price: 20
          },
          {
            name: 'frappe',
            price: 25
          }
        ],
        pic: 'http://www.fusioncaffe.com/wp-content/uploads/2014/04/Caff%C3%A8-Americano.jpg'
      },
      {
        category: 'coffee',
        name: 'esspresso',
        detail: 'เอสเปสโซ่อร่อยมาก',
        size: [{
            size: 's',
            price: 20
          },
          {
            size: 'm',
            price: 30
          },
          {
            size: 'l',
            price: 40
          }
        ],
        type: [{
            name: 'hot',
            price: 10
          },
          {
            name: 'cold',
            price: 20
          },
          {
            name: 'frappe',
            price: 25
          }
        ],
        pic: 'https://www.caffeineinformer.com/wp-content/caffeine/espresso.jpg'
      },
      {
        category: 'coffee',
        name: 'latte',
        detail: 'ลาเต้แสนอร่อย',
        size: [{
            size: 's',
            price: 20
          },
          {
            size: 'm',
            price: 30
          },
          {
            size: 'l',
            price: 40
          }
        ],
        type: [{
            name: 'hot',
            price: 10
          },
          {
            name: 'cold',
            price: 20
          },
          {
            name: 'frappe',
            price: 25
          }
        ],
        pic: 'http://caffeinekeyboard.com/wp-content/uploads/2017/06/%E0%B8%A5%E0%B8%B2%E0%B9%80%E0%B8%95%E0%B9%89.jpg'
      },
      {
        category: 'coffee',
        name: 'cappucino',
        detail: 'คาปูชิโน่ของแท้',
        size: [{
            size: 's',
            price: 20
          },
          {
            size: 'm',
            price: 30
          },
          {
            size: 'l',
            price: 40
          }
        ],
        type: [{
            name: 'hot',
            price: 10
          },
          {
            name: 'cold',
            price: 20
          },
          {
            name: 'frappe',
            price: 25
          }
        ],
        pic: 'https://www.facebook.com/photo.php?fbid=1958336984488886&set=a.1958336924488892.1073741832.100009378112488&type=3&theater'
      },
      {
        category: 'coffee',
        name: 'nocha',
        detail: 'ม่อคค่าอร่อยที่สุดในโลก',
        size: [{
            size: 's',
            price: 20
          },
          {
            size: 'm',
            price: 30
          },
          {
            size: 'l',
            price: 40
          }
        ],
        type: [{
            name: 'hot',
            price: 10
          },
          {
            name: 'cold',
            price: 20
          },
          {
            name: 'frappe',
            price: 25
          }
        ],
        pic: 'https://scontent.fbkk5-5.fna.fbcdn.net/v/t1.0-9/24296284_1958336931155558_3175586781423821564_n.jpg?oh=80cf8e994e710a0933827399bf68b1a9&oe=5AD64AAD'
      }
    ]
  });
};

exports.getCategory = function (req, res, next) {
  Category.find().sort('-created').exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.categories = categories;
      next();
    }
  });
};

exports.getProducts = function (req, res, next) {
  Product.find({}, '_id name detail pic size type category').sort('-created').populate('categories').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.products = products;
      next();
    }
  });
};

exports.cookingBestseller = function (req, res, next) {
  res.jsonp({
    bestseller: req.products,
    category: req.categories
  });
};

exports.cateID = function (req, res, next, cateid) {
  Product.find({
    category: cateid
  }, '_id name detail pic size type category').sort('-created').populate('categories').exec(function (err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.products = products;
      next();
    }
  });
};

exports.cookingProductList = function (req, res, next) {
  var products = [];
  req.products.forEach(function (element) {
    products.push({
      _id: element._id,
      name: element.name,
      pic: element.pic,
      detail: element.detail,
      size: element.size,
      type: element.type,
      category: element.category.name
    });
  });
  req.productsCookingList = products;
  next();
};

exports.productByCate = function (req, res) {
  // console.log('data' + JSON.stringify(req.productsCookingList));
  res.jsonp({
    items: req.productsCookingList ? req.productsCookingList : []
  });
};

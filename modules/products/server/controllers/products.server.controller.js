'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
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
  Product.find().sort('-created').populate('user', 'displayName').exec(function (err, products) {
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

exports.getProducAndCate = function (req, res) {
  res.jsonp({
    category: [{
      pic: 'https://www.facebook.com/photo.php?fbid=1958331227822795&set=ms.c.eJw9ysEJACAMA8CNxKRtmu6~%3BmIjg9zhMOQJkm~_yphQdwpielD7rDGx8aKCHyANGeDaE~-.bps.a.1958331157822802.1073741831.100009378112488&type=3&theater',
      name: 'coffee'
    }, {
      pic: 'https://scontent.fbkk5-5.fna.fbcdn.net/v/t1.0-9/24131284_1958331184489466_4961961287562856521_n.jpg?oh=8292396d85abaa32535b7ab010856788&oe=5AD1CD41',
      name: 'milk & chocolate'
    }, {
      pic: 'https://scontent.fbkk5-5.fna.fbcdn.net/v/t1.0-9/24131554_1958331171156134_491590508884689240_n.jpg?oh=53463c12d5e8a2012728bc305ed9e305&oe=5AD033DD',
      name: 'tea'
    }, {
      pic: 'https://scontent.fbkk5-5.fna.fbcdn.net/v/t1.0-9/24231875_1958331167822801_2679283994987165963_n.jpg?oh=3a9f359bb92059302048930a2915c465&oe=5A96A248',
      name: 'juice & smoothies'
    }],
    bestseller: [{
        name: 'americano',
        detail: 'กาแฟอเมริกาโน่แท้',
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
        pic: 'http://www.fusioncaffe.com/wp-content/uploads/2014/04/Caff%C3%A8-Americano.jpg'
      },
      {
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
      }
    ]
  });
};

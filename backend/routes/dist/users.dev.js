"use strict";

var _crypto = _interopRequireDefault(require("crypto"));

var _moment = _interopRequireDefault(require("moment"));

var _database = require("../controllers/database");

var _user = _interopRequireDefault(require("../models/user.model"));

var _expressJwt = _interopRequireDefault(require("express-jwt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var router = express.Router();

var bodyParser = require('body-parser');

require('dotenv').config('../../');

var authenticate = function authenticate(pass, salt, hash_pass) {
  return _crypto["default"].createHmac('sha256', salt).update(pass).digest('hex') === hash_pass;
};

var findMissing = function findMissing(data) {
  var missingMsg = '';

  if (!data.username || data.username === null) {
    missingMsg += "\nNo username received";
  }

  if (!data.email || data.email === null) {
    missingMsg += '\nNo email received';
  }

  return missingMsg;
};
/* GET user profile. */


router.get('/:username', function (req, res) {
  _user["default"].findOne({
    username: req.params.username
  }, function (err, user) {
    if (err) {
      return res.status(404).json({
        error: error,
        user: null
      });
    } else {
      return res.status(200).json({
        error: null,
        user: user.toJSON()
      });
    }
  });
});
/* GET users listing. */

router.get('/', function (req, res) {
  _user["default"].find({}, function (err, o) {
    res.json(o.map(function (u) {
      return u.toObject();
    }));
  });
});
/* POST to create new user */

var jsonParser = bodyParser.json();
router.post('/', jsonParser, function (req, res) {
  _user["default"].create({
    // Record to MongoDB 
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }, function (error, u) {
    if (error) {
      res.json({
        accepted: false,
        error: error.message
      });
    } else {
      res.json({
        error: '',
        accepted: true
      });
    }
  });
});
/* POST to sign in user with token to ask */

router.post('/signin', jsonParser, function (req, res) {
  var msg = findMissing(req.body);

  if (msg !== '') {
    res.json({
      error: msg
    });
  }

  _user["default"].findOne({
    username: req.body.username,
    email: req.body.email
  }, function (err, user) {
    if (!err) {
      if (user) {
        if (user.authenticate(req.body.password)) {
          var token = _jsonwebtoken["default"].sign({
            id: user.id
          }, process.env.JWT_SECRET); //        res.cookie('token', token, {expire: new Date() + 999})


          return res.json({
            user: user.toJSON(),
            token: token,
            error: err
          });
        }
      }

      return res.status(404).json({
        error: 'User not found or password wrong'
      });
    } else {
      return res.status(404).json({
        error: err
      });
    }
  });
});
/* POST to sign out user with token to ask */

router.post('/signout', jsonParser, function (req, res) {
  //   res.clearCookie('token')
  //   res.clearCookie('username')
  return res.status('200').json({
    message: 'signed out'
  });
});
module.exports = router;
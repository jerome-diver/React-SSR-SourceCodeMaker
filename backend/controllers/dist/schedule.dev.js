"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agenda_schedule = exports.agenda = void 0;

var _user = _interopRequireDefault(require("../models/user.model"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Agenda = require('agenda');

require('dotenv').config('../../');
/* Jobs to do for schedule Agenda */


var remove_outdated_users = function remove_outdated_users(job) {
  var two_days_ago;
  return regeneratorRuntime.async(function remove_outdated_users$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('start job', job);
          two_days_ago = (0, _moment["default"])().subtract(2, 'days');
          _context.next = 4;
          return regeneratorRuntime.awrap(_user["default"].deleteMany({
            created: {
              $lte: two_days_ago
            },
            validated: false
          }, function (err) {
            if (err) {
              console.log("Schedule User collection removed outdated account failed: ", err);
            } else {
              console.log('Did removed some outdated users', job);
            }
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};
/* Connect Agenda to DB */


var url_db = "mongodb://".concat(process.env.HOST, "/").concat(process.env.DB_NAME);
var agenda = new Agenda().database(url_db, 'job_schedule').processEvery('1 hour');
/* Function to add jobs to agenda then start at call time */

exports.agenda = agenda;

var agenda_schedule = function agenda_schedule(ag) {
  return regeneratorRuntime.async(function agenda_schedule$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          ag.define('Remove outdated Users', remove_outdated_users(1));
          _context2.next = 3;
          return regeneratorRuntime.awrap(ag.start());

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(ag.every('1 hour', 'Remove outdated Users'));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.agenda_schedule = agenda_schedule;
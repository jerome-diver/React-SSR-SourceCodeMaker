"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remove_outdated_users = void 0;

var _user = _interopRequireDefault(require("../models/user.model"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
              console.log('Did removed some outdated users', job.state.name);
            }
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.remove_outdated_users = remove_outdated_users;
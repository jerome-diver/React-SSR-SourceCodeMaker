"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var mongoose = require('mongoose');

var url_db = "mongodb://".concat(process.env.HOST, "/").concat(process.env.DB_NAME);
mongoose.connect(url_db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
var db = mongoose.connection; // Connect to MongoDB SourceCodeMaker database

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('connected');
});
var _default = {
  db: db,
  mongoose: mongoose
};
exports["default"] = _default;
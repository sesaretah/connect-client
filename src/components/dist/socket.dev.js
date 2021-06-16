"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socket = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

var _conf = require("../conf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//const socket = io.connect(conf.socketIOServer)
var socket = _socket["default"].connect(_conf.conf.socketIOServer, {
  transports: ['websocket']
});

exports.socket = socket;
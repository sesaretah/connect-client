"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _framework7Esm = _interopRequireDefault(require("framework7/framework7.esm.bundle"));

var _framework7React = _interopRequireDefault(require("framework7-react"));

var _App = _interopRequireDefault(require("./components/App.jsx"));

require("framework7/css/framework7.bundle.rtl.min.css");

require("./css/icons.css");

require("./css/app.css");

require("./css/editor.css");

require("./css/font-awesome.min.css");

require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");

require("./css/board.css");

require("./css/style.css");

require("./css/loader.css");

require("./css/quill.snow.css");

var serviceWorker = _interopRequireWildcard(require("./serviceWorker"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Import Framework7
// Import Framework7-React plugin
// Import main App component
// Framework7 styles
// Icons
// Custom app styles
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./firebase-messaging-sw.js").then(function (registration) {
    console.log("Registration successful, scope is:", registration.scope);
  })["catch"](function (err) {
    console.log("Service worker registration failed, error:", err);
  });
} // Init Framework7-React plugin


_framework7Esm["default"].use(_framework7React["default"]); // Mount React App


_reactDom["default"].render(_react["default"].createElement(_App["default"]), document.getElementById('root')); // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
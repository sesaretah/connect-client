"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _App = _interopRequireDefault(require("./components/App.jsx"));

var _index = _interopRequireDefault(require("./components/home/index.jsx"));

var _NotFoundPage = _interopRequireDefault(require("./containers/layouts/NotFoundPage"));

var _show = _interopRequireDefault(require("./components/profiles/show"));

var _index2 = _interopRequireDefault(require("./components/profiles/index"));

var _create = _interopRequireDefault(require("./components/profiles/create"));

var _update = _interopRequireDefault(require("./components/profiles/update"));

var _show2 = _interopRequireDefault(require("./components/rooms/show"));

var _index3 = _interopRequireDefault(require("./components/rooms/index"));

var _Login = _interopRequireDefault(require("./components/users/Login"));

var _LoginJwt = _interopRequireDefault(require("./components/users/LoginJwt"));

var _SignUp = _interopRequireDefault(require("./components/users/SignUp"));

var _Verification = _interopRequireDefault(require("./components/users/Verification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import PanelRightPage from './containers/layouts/PanelRightPage';
var _default = [{
  path: '/',
  component: _index["default"]
}, {
  path: '/:token',
  component: _index["default"]
}, {
  path: '/login/',
  component: _Login["default"]
}, {
  path: '/sign_up/',
  component: _SignUp["default"]
}, {
  path: '/verification/:email',
  component: _Verification["default"]
}, {
  path: '/login_jwt/:token',
  component: _LoginJwt["default"]
}, //{
//  path: '/panel-right/',
//  component: PanelRightPage,
//},
{
  path: '/profiles/',
  component: _index2["default"]
}, {
  path: '/profiles/:profileId/edit',
  component: _update["default"]
}, {
  path: '/profiles/new',
  component: _create["default"]
}, {
  path: '/profiles/:profileId',
  component: _show["default"]
}, {
  path: '/rooms/',
  component: _index3["default"]
}, {
  path: '/rooms/:roomId',
  component: _show2["default"]
}, {
  path: '(.*)',
  component: _NotFoundPage["default"]
}];
exports["default"] = _default;
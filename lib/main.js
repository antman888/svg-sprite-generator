"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.spriteFromFiles = undefined;

var _writer = require("./writer");

var writer = _interopRequireWildcard(_writer);

var _list = require("./source/list");

var _list2 = _interopRequireDefault(_list);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var spriteFromFiles = function spriteFromFiles(files) {
    return new Promise(function (res, rej) {
        (0, _list2.default)(files)().then(function (results) {
            res(writer.getSpriteXml(results));
        });
    });
};

exports.spriteFromFiles = spriteFromFiles;
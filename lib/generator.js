"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generate = undefined;

var _writer = require("./writer");

var writer = _interopRequireWildcard(_writer);

var _list = require("./source/list");

var _list2 = _interopRequireDefault(_list);

var _csv = require("./source/csv");

var _csv2 = _interopRequireDefault(_csv);

var _folder = require("./source/folder");

var _folder2 = _interopRequireDefault(_folder);

var _sprite = require("./source/sprite");

var _sprite2 = _interopRequireDefault(_sprite);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var generate = exports.generate = function generate() {
    _commander2.default.version("0.0.3").option("-c --csv <csv>", "CSV file path").option("-d --directory <directory>", "SVG folder").option("-l --list <list>", "List of files").option("-o --output <output>", "Out put to file").option("-s --sprite <sprite>", "Another sprite file").parse(process.argv);

    var fnList = ["sprite", "csv", "directory", "list"].filter(function (i) {
        return !!_commander2.default[i];
    }).map(function (i) {
        switch (i) {
            case "sprite":
                return (0, _sprite2.default)(_commander2.default.sprite);
            case "csv":
                return (0, _csv2.default)(_commander2.default.csv);
            case "directory":
                return (0, _folder2.default)(_commander2.default.directory);
            case "list":
                return (0, _list2.default)(_commander2.default.list.split(",").map(function (i) {
                    return i.trim();
                }));
        }
    });

    // process them all
    _async2.default.map(fnList, function (fn, callback) {
        fn().then(function (objects) {
            callback(false, objects);
        }, function (error) {
            callback(true, error);
        });
    }, function (err, results) {
        if (results.length == 0) {
            return;
        }

        var svgCount = results.reduce(function (all, r) {
            return all + r.length;
        }, 0);

        // reduces the results into one
        var svgs = results.reduce(function (prev, curr) {
            return prev.concat(curr);
        }, []);

        if (_commander2.default.output) {
            writer.writeToFile(_commander2.default.output, svgs);
            console.log('Combined', svgCount, 'svgs to', _commander2.default.output);
        } else {
            writer.writeToConsole(svgs);
        }
    });
};
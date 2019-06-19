'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (svgs) {
    return svgs.map(function (s) {
        var svgTag = _cheerio2.default.load('<div>' + s.content + '</div>', {
            xmlMode: true
        })("svg");

        var id = s.id ? s.id : svgTag.attr('id') ? svgTag.attr('id') : undefined;

        addSuffixToIds(svgTag, id);

        return svgTag.length ? {
            content: svgTag.html(),
            viewBox: svgTag.attr('viewBox'),
            id: id
        } : undefined;
    });
};

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Transform an array of SVG content to an array of objects those are
 * ready for sprite generation
 *
 * @param svgs - Array of arrays, each has 2 element, 0 -> id, 1 -> svg content
 * @return contents - Array
 */

var addSuffixToIds = function addSuffixToIds(element, suffix) {
    var tagName = element[0].name;

    // depth-first traverse of svg element tree to make ids unique
    element.children().each(function () {
        addSuffixToIds((0, _cheerio2.default)(this), suffix);
    });

    // make ids unique
    var id = element.attr('id');

    if ((tagName === 'clipPath' || tagName === 'g' || tagName === 'path') && id != null) {
        if (id !== suffix) {
            element.attr('id', id + "_" + suffix);
        }
    }

    // rename references as-per updated ids
    var clipPath = element.attr('clip-path');
    if (tagName === 'g' && clipPath != null) {
        element.attr('clip-path', clipPath.replace(/url\(\#(.*)\)/, "url(#$1" + "_" + suffix + ")"));
    }

    // rename the group id to avoid conflicts with the wrapping symbol id
    if (tagName === 'g' && id === suffix) {
        element.attr('id', 'g_' + suffix);
    }
};

;
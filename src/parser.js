import {default as cheerio} from 'cheerio';
import {default as fs} from "fs";
/*
 * Transform an array of SVG content to an array of objects those are
 * ready for sprite generation
 *
 * @param svgs - Array of arrays, each has 2 element, 0 -> id, 1 -> svg content
 * @return contents - Array
 */


const addSuffixToIds = (element, suffix) => {
    const tagName = element[0].name;
    
    // depth-first traverse of svg element tree to make ids unique
    element.children().each(function () {
        addSuffixToIds(cheerio(this), suffix);
    });

    // make ids unique
    let id = element.attr('id');

    if ((tagName === 'clipPath' || tagName === 'g' || tagName === 'path') && id != null) {
        if (id !== suffix) {
            element.attr('id', id + "_" + suffix);
        }
    }

    // rename references as-per updated ids
    let clipPath = element.attr('clip-path');
    if (tagName === 'g' && clipPath != null) {
        element.attr('clip-path', clipPath.replace(/url\(\#(.*)\)/, "url(#$1" + "_" + suffix + ")"));
    }

    // rename the group id to avoid conflicts with the wrapping symbol id
    if (tagName === 'g' && id === suffix) {
        element.attr('id', 'g_' + suffix);
    }
}

export default function (svgs) {
    return svgs.map(function (s) {
        let svgTag = cheerio.load('<div>' + s.content + '</div>', {
            xmlMode: true
        })("svg");

        const id = s.id ? s.id : (svgTag.attr('id') ? svgTag.attr('id') : undefined);
        
        addSuffixToIds(svgTag, id);

        return (svgTag.length) ? {
            content: svgTag.html(),
            viewBox: svgTag.attr('viewBox'),
            id: id,
        } : undefined;
    });
};


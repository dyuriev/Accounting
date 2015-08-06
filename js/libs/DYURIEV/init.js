/**
 * DYURIEV - namespace for Dmitriy Yuriev libs
 * @author Dmitriy Yuriev
 */

var DYURIEV = DYURIEV || {};

DYURIEV.namespace = function (string) {
    var parts = string.split('.'),
        parent = DYURIEV, i;

    if (parts[0] === 'DYURIEV') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

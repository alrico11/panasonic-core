const path = require('path');

module.exports = function (options) {
    return {
        ...options,
        resolve: {
            ...options.resolve,
            alias: {
                ...options.resolve?.alias,
                '@lib': path.resolve(__dirname, 'libs/index.js'),
            },
        },
    };
};

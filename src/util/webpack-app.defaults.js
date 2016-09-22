/* eslint no-var: 0 */

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var _ = require('lodash');
var autoprefixer = require('autoprefixer');

var applyDefaults = function(cfg) {

    // This ensures that requires like mdl are added at the top of the header
    var cssInsert = (cfg.debug) ? 'top' : 'bottom';

    var cssLoader = 'css!postcss';

    var urlLoader = 'url?limit=10000';

    var fileName = '[name].[ext]?[hash:5]';

    var imageLoader = urlLoader + '&name=image/' + fileName;

    var fontLoader = urlLoader + '&name=fonts/' + fileName;

    // extend config
    return _.merge(cfg, {
        resolveLoader: {
            root: path.join(__dirname, '..', 'node_modules'),
            fallback: path.join(__dirname, '..', 'node_modules'),
        },
        resolve: {
            packageMains: [
                'style',
                'es5',
                'webpack',
                'browserify',
                'main'
            ],
            extensions: ['', '.js', '.jsx'],
            modulesDirectories: ['node_modules'],
            fallback: path.join(cfg.context, 'node_modules'),
            alias: {
                // fix for broken RxJS requiring by webpack
                // TODO: remove once fixed in webpack
                rx: 'rx/dist/rx.all.js'
            }
        },
        node: {
            fs: 'empty',
        },
        eslint: {
            configFile: path.join(__dirname, '..', 'rules', 'eslintrc.yml'),
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    exclude: [
                        /node_modules/,
                        path.join(cfg.context, 'lib')
                    ],
                    loader: 'eslint-loader'
                },
            ],
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style?insertAt=' + cssInsert, cssLoader),
                },
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style?insertAt=' + cssInsert, cssLoader + '!less'),
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style?insertAt=' + cssInsert, cssLoader + '!sass'),
                },
                {
                    test: /\.json$/,
                    loader: 'json',
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: {
                        plugins: ['transform-runtime'],
                        presets: ['eccenca']
                    },
                },
                {
                    test: /\.woff\d?(\?.+)?$/,
                    loader: fontLoader + '&mimetype=application/font-woff',
                },
                {
                    test: /\.ttf(\?.+)?$/,
                    loader: fontLoader + '&mimetype=application/octet-stream',
                },
                {
                    test: /\.eot(\?.+)?$/,
                    loader: fontLoader + '&mimetype=application/vnd.ms-fontobject',
                },
                {
                    test: /\.svg(\?.+)?$/,
                    loader: imageLoader + '&mimetype=image/svg+xml',
                },
                {
                    test: /\.png$/,
                    loader: imageLoader + '&mimetype=image/png',
                },
                {
                    test: /\.jpe?g$/,
                    loader: imageLoader + '&mimetype=image/jpeg',
                },
                {
                    test: /\.gif$/,
                    loader: imageLoader + '&mimetype=image/gif',
                },
                {
                    test: /\.ico$/,
                    loader: imageLoader + '&mimetype=image/x-icon',
                },
            ],
        },
        postcss: function() {
            return [autoprefixer];
        },
    }, function(a, b) {
        if (_.isArray(a)) {
            return a.concat(b);
        }
    });
};

module.exports = applyDefaults;
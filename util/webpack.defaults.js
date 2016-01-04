var path = require('path');
var _ = require('lodash');

var applyDefaults = function(cfg) {
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
            configFile: path.join(__dirname, '..', 'rules', 'eslintrc.json'),
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader'
                },
            ],
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css', 'autoprefixer?browsers=last 3 version'],
                },
                {
                    test: /\.json$/,
                    loader: 'json',
                },
                {
                    test: /\.less$/,
                    loaders: ['style', 'css', 'autoprefixer?browsers=last 3 version', 'less'],
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'autoprefixer?browsers=last 3 version', 'sass'],
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015-loose', 'stage-0', 'react'],
                        plugins: ['transform-es2015-modules-commonjs']
                    },
                },
                {
                    test: /\.woff\d?(\?.+)?$/,
                    loader: 'url?limit=150000&minetype=application/font-woff',
                },
                {
                    test: /\.ttf(\?.+)?$/,
                    loader: 'url?limit=150000&minetype=application/octet-stream',
                },
                {
                    test: /\.eot(\?.+)?$/,
                    loader: 'url?limit=150000',
                },
                {
                    test: /\.svg(\?.+)?$/,
                    loader: 'url?limit=150000&minetype=image/svg+xml',
                },
                {
                    test: /\.png$/,
                    loader: 'url-loader?limit=150000&mimetype=image/png',
                },
            ],
        },
    }, function(a, b) {
        if (_.isArray(a)) {
            return a.concat(b);
        }
    });
};

module.exports = applyDefaults;

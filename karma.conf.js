const webpack = require("webpack");
const jQuery = require("jquery")

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: ['https://code.jquery.com/jquery-3.5.1.min.js', 'test/*.test.ts'],
        mime: { 'text/x-typescript': ['ts','tsx'] },
        preprocessors: {
            'test/*.test.ts': ['webpack', 'sourcemap'],
        },
        webpack: {
            resolve: {
                extensions: ['.js', '.ts', '.tsx']
            },
            module: {
                rules: [
                    {test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/},
                    {
                      test: /\.scss$/,
                      use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                      ]
                    }
                ]
            },
            stats: {
                colors: true,
                modules: true,
                reasons: true,
                errorDetails: true
            },
            plugins: [
                new webpack.SourceMapDevToolPlugin({
                    filename: null, // if no value is provided the sourcemap is inlined
                    test: /\.(ts|js)($|\?)/i, // process .js and .ts files only
                    exclude: [ /node_modules/ ]
                })
            ]
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
}
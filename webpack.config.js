const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodemonWebpackPlugin = require('nodemon-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

module.exports = [
    {
        name: 'frontend',
        entry: path.join(__dirname, 'frontend/index.js'),
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
        },
        output: {
            path: path.resolve(__dirname, 'dist/frontend'),
            filename: 'bundle.js',
            publicPath: '/',
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new CopyWebpackPlugin({
                patterns: [{ from: 'frontend/static' }],
            }),
        ],
        devServer: {
            port: 3001,
            proxy: [
                {
                    context: ['/auth', '/api', '/webhook', '/install'],
                    target: 'http://localhost:3000',
                },
            ],
            // required for app to display in zoom client, these values are only suitable for development
            headers: {
                'Content-Security-Policy':
                    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
                'Strict-Transport-Security':
                    'max-age=31536000; includeSubDomains',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'same-origin',
            },
            allowedHosts: ['.ngrok.io', '.ngrok-free.app'],
            hot: true,
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                    runtimeErrors: true,
                },
            },
        },
    },
    {
        name: 'server',
        entry: path.join(__dirname, 'server/index.js'),
        target: 'node',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
            ],
        },
        output: {
            path: path.resolve(__dirname, 'dist/server'),
            filename: 'bundle.js',
        },
        plugins: [
            new DotenvPlugin({
                path: './server/.env',
            }),
            new NodemonWebpackPlugin({}),
        ],
    },
];

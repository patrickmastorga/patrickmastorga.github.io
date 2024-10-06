const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var project_pages = fs.readdirSync('project-pages')
    .filter(file => file.endsWith('.html'))
    .map(file => path.join('project-pages', file))

module.exports = {
    entry: {
        common: './common.js',  // common JS/CSS
        home: './home.js',  // JS/CSS for index.html
        project: './project-pages/project.js',  // JS/CSS for project pages
    },
    output: {
        filename: '[name].bundle.js', // Output filename based on entry point name
        path: path.resolve(__dirname, '../dist'),
        clean: true,
    },
    mode: 'production',
    optimization: {
        splitChunks: {
            chunks: 'all',  // Split chunks for all types of imports
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name]-[hash][ext]'
                }
            },
            {
                test: /\.pdf$/,
                type: 'asset/resource',
                generator: {
                    filename: 'documents/[name]-[hash][ext]'
                }
            },
            {
                test: /\.(mtl|obj|glb)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'models/[name]-[hash][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name]-[hash][ext]'
                }
            },
            {
                test: /\.html$/,
                use: ['html-loader'], // Ensure images in HTML get processed
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            chunks: ['common', 'home'],
        }),
        ...project_pages.map(file =>
            new HtmlWebpackPlugin({
                template: file,
                filename: file,
                chunks: ['common', 'project'],
            })
        )
    ],
};

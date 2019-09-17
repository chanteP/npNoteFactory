const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'note.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, '/node_modules'),
                include: path.resolve(__dirname, '/src'),
                options: {
                    presets: ['env']
                }
            },
        ]
    },

    resolve: {
        extensions: [".js", ".mjs"]
    },
}

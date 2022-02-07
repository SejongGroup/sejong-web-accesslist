module.exports = {
    entry: "./public/js/keyboard.js",
    output: {
        path: __dirname,
        filename: "./public/js/main.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};

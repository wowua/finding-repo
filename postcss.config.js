module.exports = {
  plugins: [
    require("postcss-flexbugs-fixes"),
    require("postcss-normalize"),
    require("autoprefixer")({
      cascade: false,
    }),
  ],
};

module.exports = {
  webpack: (config, options, webpack) => {
    config.plugins = [
      ...config.plugins,
      new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    ];
    return config;
  },
};

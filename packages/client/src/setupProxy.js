const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/maps",
    createProxyMiddleware({
      target: "http://localhost:3005",
      changeOrigin: true,
      pathRewrite: { "^/maps": "" },
      logLevel: "debug",
    })
  );
};

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

router.use('/', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/manager': '',  // ✅ remove /api/student before sending
  },
}));

module.exports = router;

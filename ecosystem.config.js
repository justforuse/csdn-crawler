module.exports = {
  apps: [{
    name: "csdn-crawler",
    script: "./dist/index.js",
    env: {
      PORT: 5000
    }
  }]
}

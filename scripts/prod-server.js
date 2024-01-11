const path = require("path");
const handler = require("serve-handler");
const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((request, response) => {
  if (request.method === "POST") {
    console.log(`Proxying POST request... ${request.url}`);
    return proxy.web(request, response, { target: "http://localhost:9090" });
  }
  return handler(request, response, {
    public: path.resolve(__dirname, "../build"),
    rewrites: [
      {
        source: "**",
        destination: "./index.html",
      },
    ],
  });
});

server.listen(3000, () => {
  console.log("Running at http://localhost:3000");
});

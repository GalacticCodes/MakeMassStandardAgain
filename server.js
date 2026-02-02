const http = require("http");
const https = require("https");
const { URL } = require("url");

const PORT = 4175;

function fetchYahooQuote(symbols, res) {
  const url = new URL("https://query1.finance.yahoo.com/v7/finance/quote");
  url.searchParams.set("symbols", symbols);

  https
    .get(url, (yahooRes) => {
      let data = "";
      yahooRes.on("data", (chunk) => {
        data += chunk;
      });
      yahooRes.on("end", () => {
        res.writeHead(yahooRes.statusCode || 200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        });
        res.end(data);
      });
    })
    .on("error", (err) => {
      res.writeHead(502, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(JSON.stringify({ error: err.message }));
    });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (url.pathname === "/quote") {
    const symbols = url.searchParams.get("symbols") || "";
    if (!symbols.trim()) {
      res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(JSON.stringify({ error: "symbols parameter required" }));
      return;
    }
    fetchYahooQuote(symbols, res);
    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Yahoo proxy running on http://localhost:${PORT}`);
});

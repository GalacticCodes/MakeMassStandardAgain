import http.server
import json
import os
import socketserver
import urllib.parse
import urllib.request

PORT = 4180
YAHOO_URL = "https://query1.finance.yahoo.com/v7/finance/quote"
CACHE_TTL_SECONDS = 24 * 60 * 60
CACHE = {"timestamp": 0, "data": b""}
CACHE_FILE = "yahoo_cache.json"


def load_cache():
    if not os.path.exists(CACHE_FILE):
        return
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as handle:
            payload = json.load(handle)
        CACHE["timestamp"] = int(payload.get("timestamp", 0))
        data = payload.get("data", "")
        CACHE["data"] = data.encode("utf-8") if isinstance(data, str) else b""
    except Exception:
        return


def save_cache():
    try:
        payload = {
            "timestamp": CACHE["timestamp"],
            "data": CACHE["data"].decode("utf-8", errors="ignore"),
        }
        with open(CACHE_FILE, "w", encoding="utf-8") as handle:
            json.dump(payload, handle)
    except Exception:
        return


class YahooProxyHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/quote":
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))
            return

        params = urllib.parse.parse_qs(parsed.query)
        symbols = params.get("symbols", [""])[0]
        if not symbols.strip():
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(
                json.dumps({"error": "symbols parameter required"}).encode("utf-8")
            )
            return

        url = f"{YAHOO_URL}?symbols={urllib.parse.quote(symbols)}"
        try:
            now = int(__import__("time").time())
            if CACHE["data"] and now - CACHE["timestamp"] < CACHE_TTL_SECONDS:
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(CACHE["data"])
                return

            with urllib.request.urlopen(url, timeout=10) as resp:
                data = resp.read()
                CACHE["timestamp"] = now
                CACHE["data"] = data
                save_cache()
                self.send_response(resp.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(data)
        except Exception as exc:
            self.send_response(502)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(exc)}).encode("utf-8"))

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    load_cache()
    with socketserver.TCPServer(("", PORT), YahooProxyHandler) as httpd:
        print(f"Yahoo proxy running on http://localhost:{PORT}")
        httpd.serve_forever()

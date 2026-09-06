#!/usr/bin/env python3
"""本地開發伺服器：模擬原站的路由（/zh、/zh/place/<slug>、/zh/about、/zh/credits），其餘走 public/ 靜態檔。

用法：python3 serve.py [--port 3000]
"""
import argparse, os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")
LOCALES = ("zh", "en")
TESTS = os.path.join(os.path.dirname(ROOT), "tests")
ROUTES = [
    (re.compile(r"^/(zh|en)/?$"), "index.html"),
    (re.compile(r"^/(zh|en)/place/[^/]+/?$"), "place.html"),
    (re.compile(r"^/(zh|en)/about/?$"), "about.html"),
    (re.compile(r"^/(zh|en)/credits/?$"), "credits.html"),
]


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json; charset=utf-8",
        ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8",
    }

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/":
            self.send_response(302); self.send_header("Location", "/zh"); self.end_headers(); return
        if path == "/__smoke":
            self.directory = TESTS; self.path = "/smoke.html"; return super().do_GET()
        for rx, page in ROUTES:
            if rx.match(path):
                self.path = "/" + page + ("?" + urlsplit(self.path).query if urlsplit(self.path).query else "")
                break
        return super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=3000)
    ap.add_argument("--host", default="127.0.0.1")
    args = ap.parse_args()
    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"nextplace local clone → http://{args.host}:{args.port}/zh  (Ctrl+C 停止)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass

#!/usr/bin/env python3
# Simple static server to serve the web app folder.
import http.server, socketserver, os, sys
PORT = 8000
# serve the inner folder if exists
base = os.path.join(os.path.dirname(__file__), 'susucoffee')
if not os.path.isdir(base):
    base = os.path.dirname(__file__)
handler = http.server.SimpleHTTPRequestHandler
os.chdir(base)
with socketserver.TCPServer(("", PORT), handler) as httpd:
    host = 'localhost'
    url = f'http://{host}:{PORT}/index.html'
    print("Server started. Open this link in your browser:")
    print(url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\nShutting down.")